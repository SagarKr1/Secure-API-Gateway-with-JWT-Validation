import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Chip,
    Box,
    Stack,
    CircularProgress,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

export default function ApiLogsPage() {
    const [logFiles, setLogFiles] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [fileLogs, setFileLogs] = useState({});
    const [loading, setLoading] = useState({});

    const getStatusColor = (status) => {
        if (status >= 200 && status < 300) return "success";
        if (status >= 400 && status < 500) return "warning";
        if (status >= 500) return "error";
        return "default";
    };

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/log/all");
                if (Array.isArray(res.data?.body)) {
                    setLogFiles(res.data.body);
                } else {
                    console.error("❌ Unexpected logs list format:", res.data?.body);
                }
            } catch (err) {
                console.error("❌ Error fetching log files:", err);
            }
        };
        fetchFiles();
    }, []);

    const handleChange = (file) => async (_event, isExpanded) => {
        setExpanded(isExpanded ? file : false);

        if (isExpanded && !fileLogs[file]) {
            setLoading((prev) => ({ ...prev, [file]: true }));
            try {
                const res = await axios.get(`http://localhost:8080/api/log/view/${file}`);
                let lines = [];

                if (Array.isArray(res.data?.body)) {
                    lines = res.data.body;
                } else if (typeof res.data?.body === "string") {
                    lines = res.data.body.split("\n").filter(Boolean);
                } else {
                    console.error(`❌ Unexpected log content format for ${file}:`, res.data?.body);
                }

                const parsed = lines.map((line) => ({
                    time: line.substring(0, 20),
                    endpoint: line.substring(23),
                    status: 200, // 👉 Replace with real status parse if needed
                }));

                setFileLogs((prev) => ({ ...prev, [file]: parsed }));
            } catch (err) {
                console.error(`❌ Error reading ${file}:`, err);
            } finally {
                setLoading((prev) => ({ ...prev, [file]: false }));
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                component={RouterLink}
                to="/admin-dashboard"
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>

            <Typography variant="h4" gutterBottom>
                API Logs
            </Typography>

            {logFiles.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    ⚠️ No log files found.
                </Typography>
            ) : (
                logFiles.map((file) => (
                    <Accordion
                        key={file}
                        expanded={expanded === file}
                        onChange={handleChange(file)}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{file}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {loading[file] ? (
                                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : fileLogs[file] && fileLogs[file].length > 0 ? (
                                <Paper elevation={1} sx={{ p: 2 }}>
                                    <Stack spacing={1}>
                                        {fileLogs[file].map((log, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    p: 1.5,
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
                                                    sx={{ ml: 2 }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    ⚠️ No logs in this file.
                                </Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Container>
    );
}
