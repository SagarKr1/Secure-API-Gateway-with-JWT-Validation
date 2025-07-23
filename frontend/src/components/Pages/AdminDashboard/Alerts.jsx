// src/components/Pages/Alerts/AlertsPage.js

import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AlertsPage() {
    const [files, setFiles] = useState([]);
    const [logs, setLogs] = useState({});
    const [expanded, setExpanded] = useState(false);
    const token = sessionStorage.getItem('token');

    const navigate = useNavigate();

    const fetchFiles = async () => {
        try {
            const res = await axios.get("/api/log/alerts/all",{
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data.body)) {
                setFiles(res.data.body);
            } else {
                toast.info("No alert files found.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch alert files.");
        }
    };

    const fetchLogs = async (filename) => {
        try {
            const res = await axios.get(`/api/log/alerts/view/${filename}`,{
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data.body)) {
                setLogs((prev) => ({ ...prev, [filename]: res.data.body }));
            } else {
                setLogs((prev) => ({ ...prev, [filename]: [] }));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch logs.");
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleAccordionChange = (file) => (event, isExpanded) => {
        setExpanded(isExpanded ? file : false);
        if (isExpanded && !logs[file]) {
            fetchLogs(file);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2 }}
                onClick={() => navigate("/admin-dashboard")}
            >
                Back to Dashboard
            </Button>

            <Typography variant="h4" gutterBottom>
                System Alerts
            </Typography>

            {files.length === 0 ? (
                <Typography>No alert files found.</Typography>
            ) : (
                files.map((file) => (
                    <Accordion
                        key={file}
                        expanded={expanded === file}
                        onChange={handleAccordionChange(file)}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{file}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {logs[file] && logs[file].length > 0 ? (
                                <List>
                                    {logs[file].map((log, idx) => (
                                        <ListItem key={idx} divider>
                                            <ListItemText primary={log} />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography>No logs found in this file.</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Container>
    );
}
