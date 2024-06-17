import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/system';
import logo from './logo.png';  // Ensure this import is correct

const Root = styled(Box)({
    background: 'linear-gradient(135deg, #000000 30%, #004d00 100%)',
    color: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
});

const FormContainer = styled(Container)({
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
});

const Logo = styled('img')({
    width: '100px',
    height: '100px',
    marginBottom: '16px',
});

const Title = styled(Typography)({
    marginBottom: '16px',
    textAlign: 'center',
});

const Form = styled('form')({
    width: '100%',
});

const CustomTextField = styled(TextField)({
    marginBottom: '16px',
    '& label.Mui-focused': {
        color: '#76ff03',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#76ff03',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#76ff03',
        },
        '&:hover fieldset': {
            borderColor: '#76ff03',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#76ff03',
        },
    },
});

const CustomButton = styled(Button)({
    marginTop: '16px',
    backgroundColor: '#76ff03',
    color: '#000',
    '&:hover': {
        backgroundColor: '#64dd17',
    },
});

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/register', { username, password, role });
            alert('User registered successfully');
            navigate('/');
        } catch (error) {
            console.error('Signup failed', error);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <Root>
            <Logo src={logo} alt="Logo" />
            <Title variant="h4">Welcome to 3S Fitness Technology Backend Software</Title>
            <FormContainer>
                <Typography variant="h4" gutterBottom>Signup</Typography>
                <Form onSubmit={handleSignup}>
                    <CustomTextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <CustomTextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <CustomTextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <CustomTextField
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        select
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </CustomTextField>
                    <CustomButton variant="contained" color="primary" type="submit">Signup</CustomButton>
                </Form>
            </FormContainer>
        </Root>
    );
};

export default SignupPage;
