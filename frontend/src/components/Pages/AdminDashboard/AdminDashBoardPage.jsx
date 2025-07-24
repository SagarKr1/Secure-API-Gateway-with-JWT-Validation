import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Button,
    Chip,
    Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

// ✅ NEW: Import react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
    const [stats] = useState({
        totalRequests: 12345,
        activeUsers: 20,
        rateLimitBlocks: 15,
        blockedIPs: 5,
    });

    const token = sessionStorage.getItem('token');


    const [alerts, setAlerts] = useState([]);
    const [logs, setLogs] = useState([]);

    const getStatusColor = (status) => {
        if (status >= 200 && status < 300) return "success";
        if (status >= 400 && status < 500) return "warning";
        if (status >= 500) return "error";
        return "default";
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/log/recent",{
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data?.body) {
                    const parsed = res.data.body.map((line) => {
                        const time = line.substring(0, 20);
                        const rest = line.substring(23);
                        const status = 200; // Dummy — replace with parsing if needed
                        return { time, endpoint: rest, status };
                    });
                    setLogs(parsed);
                }
            } catch (err) {
                console.error("❌ Error fetching logs:", err);
            }
        };

        const fetchAlerts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/log/alerts/recent",{
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Alerts API:", res.data); // ✅ NEW: Debug

                if (res.data?.body) {
                    setAlerts(res.data.body);

                    // ✅ NEW: Show toast for each alert
                    res.data.body.forEach((alert) => {
                        toast.info(`🚨 Alert: ${alert}`, {
                            position: "top-right",
                            autoClose: 5000,
                        });
                    });
                }
            } catch (err) {
                console.error("❌ Error fetching alerts:", err);
            }
        };

        fetchLogs();
        fetchAlerts();
    }, []);

    return (
        <Container
            maxWidth="lg"
            sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
        >
            {/* ✅ NEW: Toast Container */}
            <ToastContainer />

            <Typography variant="h4" gutterBottom textAlign="center">
                Admin Dashboard
            </Typography>

            <Grid container spacing={3} justifyContent="center" textAlign="center">
                {Object.entries(stats).map(([key, value]) => (
                    <Grid item xs={12} sm={6} md={3} key={key}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="body1">{key}</Typography>
                            <Typography variant="h5" color="primary">{value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 4 }} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" gutterBottom>
                                Alerts
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                component={RouterLink}
                                to="/admin-dashboard/alerts"
                            >
                                View All Alerts
                            </Button>
                        </Box>

                        {alerts.length > 0 ? (
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                {alerts.map((alert, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 2,
                                            bgcolor: "#fff5f5",
                                            borderRadius: 1,
                                            textAlign: "left",
                                        }}
                                    >
                                        <Typography variant="body2">{alert}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: "#f5f5f5",
                                    borderRadius: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    ✅ No alerts found.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" gutterBottom>
                                Recent API Logs
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                component={RouterLink}
                                to="/admin-dashboard/logs"
                            >
                                View All Logs
                            </Button>
                        </Box>

                        {logs.length > 0 ? (
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                {logs.map((log, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            p: 2,
                                            bgcolor: "#f9f9f9",
                                            borderRadius: 1,
                                            border: "1px solid #ddd",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ flex: 1 }}>
                                            {log.time} {log.endpoint}
                                        </Typography>
                                        <Chip
                                            label={log.status}
                                            color={getStatusColor(log.status)}
                                            size="small"
                                            sx={{ ml: 2, minWidth: "40px", textAlign: "center" }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: "#f5f5f5",
                                    borderRadius: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    ⚠️ No logs found.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}