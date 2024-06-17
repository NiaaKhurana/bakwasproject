import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    MenuItem,
    Switch,
    FormControlLabel,
} from '@mui/material';

const EntryFormPage = () => {
    const { database, id } = useParams();
    const [entry, setEntry] = useState({
        Common_Ingredient_Additive_Name: "",
        FSSAI_Ref_Regulation_Rule_List: "",
        Schedule_I: false,
        Schedule_II: false,
        Schedule_III: false,
        Schedule_IV: false,
        Schedule_VA: false,
        Schedule_VB: false,
        Schedule_VC: false,
        Schedule_VD: false,
        Schedule_VE: false,
        Schedule_VF: false,
        Schedule_VI: false,
        Schedule_VIE: false,
        Schedule_VII: false,
        Schedule_VIII: false,
        RSSR: false,
        BANNED: false,
        INS: 0,
        UpperLimit: 0,
        LowerLimit: 0,
        Unit: "",
        Warning_Comment: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchEntry = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:3000/api/${database}/${id}`, {
                        headers: { 'x-access-token': token },
                    });
                    setEntry(response.data);
                } catch (error) {
                    console.error('Error fetching entry:', error);
                }
            };

            fetchEntry();
        }
    }, [id, database]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setEntry((prevState) => ({
                ...prevState,
                Schedule_I: false,
                Schedule_II: false,
                Schedule_III: false,
                Schedule_IV: false,
                Schedule_VA: false,
                Schedule_VB: false,
                Schedule_VC: false,
                Schedule_VD: false,
                Schedule_VE: false,
                Schedule_VF: false,
                Schedule_VI: false,
                Schedule_VIE: false,
                Schedule_VII: false,
                Schedule_VIII: false,
                RSSR: false,
                BANNED: false,
                [name]: checked
            }));
        } else {
            setEntry({
                ...entry,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (id) {
                await axios.put(`http://localhost:3000/api/${database}/${id}`, entry, {
                    headers: { 'x-access-token': token },
                });
            } else {
                await axios.post(`http://localhost:3000/api/${database}`, entry, {
                    headers: { 'x-access-token': token },
                });
            }
            navigate(`/entries/${database}`);
        } catch (error) {
            console.error('Error submitting entry:', error);
            alert('Error submitting entry');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {id ? 'Edit Entry' : 'Add New Entry'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Common Ingredient/Additive Name"
                    name="Common_Ingredient_Additive_Name"
                    value={entry.Common_Ingredient_Additive_Name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="FSSAI Ref Regulation Rule List"
                    name="FSSAI_Ref_Regulation_Rule_List"
                    value={entry.FSSAI_Ref_Regulation_Rule_List}
                    onChange={handleChange}
                    select
                    fullWidth
                    margin="normal"
                >
                    {/* Populate with actual options */}
                    <MenuItem value="Option 1">Option 1</MenuItem>
                    <MenuItem value="Option 2">Option 2</MenuItem>
                </TextField>
                {['Schedule_I', 'Schedule_II', 'Schedule_III', 'Schedule_IV', 'Schedule_VA', 'Schedule_VB', 'Schedule_VC', 'Schedule_VD', 'Schedule_VE', 'Schedule_VF', 'Schedule_VI', 'Schedule_VIE', 'Schedule_VII', 'Schedule_VIII', 'RSSR', 'BANNED'].map((schedule) => (
                    <FormControlLabel
                        key={schedule}
                        control={
                            <Switch
                                checked={entry[schedule]}
                                onChange={handleChange}
                                name={schedule}
                                color="primary"
                            />
                        }
                        label={schedule.replace('_', ' ')}
                    />
                ))}
                <TextField
                    label="INS"
                    name="INS"
                    value={entry.INS}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Upper Limit"
                    name="UpperLimit"
                    value={entry.UpperLimit}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Lower Limit"
                    name="LowerLimit"
                    value={entry.LowerLimit}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Unit"
                    name="Unit"
                    value={entry.Unit}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Warning Comment"
                    name="Warning_Comment"
                    value={entry.Warning_Comment}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit">
                    {id ? 'Update' : 'Add'}
                </Button>
            </form>
        </Container>
    );
};

export default EntryFormPage;
