import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, List, ListItem, ListItemText, Button, Typography } from '@mui/material';

const DatabaseListPage = () => {
    const [databases, setDatabases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDatabases = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/databases', {
                headers: { 'x-access-token': token },
            });
            setDatabases(response.data);
        };

        fetchDatabases();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Select Database
            </Typography>
            <List>
                {databases.map((db) => (
                    <ListItem button key={db.name} onClick={() => navigate(`/entries/${db.name}`)}>
                        <ListItemText primary={db.name} />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
            </Button>
        </Container>
    );
};

export default DatabaseListPage;