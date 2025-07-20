import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import MyUserBlogs from './Blog'; // 👉 The user CRUD component

export default function UserDashboard() {
    const [tab, setTab] = useState(0);

    const handleTabChange = (_, newValue) => {
        setTab(newValue);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>User Dashboard</Typography>

            <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="My Blogs" />
            </Tabs>

            <Box hidden={tab !== 0}>
                <MyUserBlogs />
            </Box>
        </Container>
    );
}
