import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DatabaseListPage from './components/DatabaseListPage';
import EntriesPage from './components/EntriesPage';
import EntryFormPage from './components/EntryFormPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SignupPage from "./components/SignupPage";

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/databases" element={<DatabaseListPage />} />
                    <Route path="/entries/:database" element={<EntriesPage />} />
                    <Route path="/entry-form/:database/:id?" element={<EntryFormPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;