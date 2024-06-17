import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Typography,
    TablePagination,
} from '@mui/material';

const EntriesPage = () => {
    const { database } = useParams();
    const [entries, setEntries] = useState([]);
    const [columns, setColumns] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEntries = async () => {
            let token = localStorage.getItem('token');
            const responseStruc = await axios.get(`http://localhost:3000/structure/columns/${database}`, {
                headers: { 'x-access-token': token },
            });
            setColumns(responseStruc.data);
            token = localStorage.getItem('token');

            const response = await axios.get(`http://localhost:3000/api/${database}`, {
                params: { page: page + 1, limit: rowsPerPage },
                headers: { 'x-access-token': token },
            });
            console.log(response.data)
            setEntries(response.data);
        };
        fetchEntries();

    }, [database, page, rowsPerPage]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/${database}/${id}`, {
                headers: { 'x-access-token': token },
            });
            setEntries(entries.filter((entry) => entry.id !== id));
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Entries in {database}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/entry-form/${database}`)}
            >
                Add New Entry
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell key={"actions"} >Actions</TableCell>
                        {columns.map((entry) => {
                            return <TableCell key={entry.Field}>{entry.Field}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate(`/entry-form/${database}/${entry.id}`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDelete(entry.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                            {Object.keys(entry).map((e => {
                                console.log(entry[e])
                                return <TableCell key={entry[e]}>{entry[e]}</TableCell>;
                            }))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={-1} // Unknown total count
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
};

export default EntriesPage;