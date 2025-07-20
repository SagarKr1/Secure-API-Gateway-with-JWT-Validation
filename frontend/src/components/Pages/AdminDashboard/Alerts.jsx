// src/components/Pages/Alerts/AlertsPage.js

import React from "react";
import { Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

export default function AlertsPage() {
    // Ideally, you fetch these from API — using static for demo
    const alerts = [
        "IP 192.168.1.10 exceeded rate limit",
        "Multiple failed logins from 10.0.0.5",
        "API key misuse detected",
        "Suspicious activity from IP 172.16.0.8",
        "Brute force attempt detected",
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                System Alerts
            </Typography>

            <Paper sx={{ p: 2 }}>
                <List>
                    {alerts.map((alert, idx) => (
                        <ListItem key={idx} divider>
                            <ListItemText primary={alert} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}
