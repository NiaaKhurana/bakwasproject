import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import logo from './logo.png'; // Ensure this import is correct

const RootContainer = styled(Container)({
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Roboto", sans-serif', // Adding padding to avoid content touching edges
    boxSizing: 'border-box', // Ensures padding is included in the element's total width and height
});

const StyledTextField = styled(TextField)({
    marginBottom: '20px',
    '& label': {
        color: '#ffffff',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: '#ffffff',
    },
    '& .MuiInput-underline:hover:before': {
        borderBottomColor: '#4caf50',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#4caf50',
    },
    '& input': {
        color: '#ffffff',
    }
});

const StyledButton = styled(Button)({
    backgroundColor: '#4caf50',
    color: '#ffffff',
    '&:hover': {
        backgroundColor: '#45a049',
    }
});

const StyledLink = styled(Link)({
    color: '#4caf50',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    }
});

const Logo = styled('img')({
    width: '100px',
    height: '100px',
    marginBottom: '16px',
});

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/login', { id, password });
            localStorage.setItem('token', response.data.token);
            navigate('/databases');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    return (
        <RootContainer>
            <Logo src={logo} alt="Logo" />
            <Typography variant="h4" gutterBottom>
                Welcome to 3S Fitness Technology Backend Software
            </Typography>
            <Typography variant="h6" gutterBottom>
                Login
            </Typography>
            <StyledTextField
                label="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                fullWidth
            />
            <StyledTextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />
            <StyledButton variant="contained" onClick={handleLogin}>
                Login
            </StyledButton>
            <Box mt={2}>
                <Typography variant="body1">
                    Not a registered user?{' '}
                    <StyledLink to="/signup">
                        Sign up
                    </StyledLink>
                </Typography>
            </Box>
        </RootContainer>
    );
};

export default LoginPage;
