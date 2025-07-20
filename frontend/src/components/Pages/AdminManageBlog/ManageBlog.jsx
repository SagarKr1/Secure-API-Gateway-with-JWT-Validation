import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';

import MyBlogs from './myBlog';
import ApprovedBlogs from './approveBlog';
import PendingApprovalBlogs from './notApprovedBlog';

export default function ManageBlogs() {
    const [tab, setTab] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ Get token & decode role
    const token = sessionStorage.getItem('token');
    let role = 'user';

    try {
        if (token) {
            const decoded = jwtDecode(token);
            role = decoded.role || 'user';
        }
    } catch (err) {
        console.error('Invalid JWT:', err);
    }

    // ✅ Handle tab switch
    const handleTabChange = (_, newValue) => setTab(newValue);

    // ✅ Call this from child components to refresh all tabs
    const triggerRefresh = () => setRefreshKey(prev => prev + 1);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Manage Blogs
            </Typography>

            <Tabs value={tab} onChange={handleTabChange}>
                <Tab label="My Blogs" />
                {role === 'admin' && <Tab label="Approved Blogs" />}
                {role === 'admin' && <Tab label="Pending Approval" />}
            </Tabs>

            <Box hidden={tab !== 0} sx={{ mt: 3 }}>
                <MyBlogs refreshKey={refreshKey} triggerRefresh={triggerRefresh} />
            </Box>

            {role === 'admin' && (
                <Box hidden={tab !== 1} sx={{ mt: 3 }}>
                    <ApprovedBlogs refreshKey={refreshKey} triggerRefresh={triggerRefresh} />
                </Box>
            )}

            {role === 'admin' && (
                <Box hidden={tab !== 2} sx={{ mt: 3 }}>
                    <PendingApprovalBlogs refreshKey={refreshKey} triggerRefresh={triggerRefresh} />
                </Box>
            )}
        </Container>
    );
}
