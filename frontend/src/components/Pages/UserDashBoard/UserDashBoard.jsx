import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button, Grid, Paper } from "@mui/material";

export default function UserDashboard() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");

    const handlePost = (e) => {
        e.preventDefault();
        // TODO: Implement POST blog logic here
        console.log("Posting blog:", { title, content });
        setMessage("Blog posted successfully!");
        setTitle("");
        setContent("");
    };

    const handleReport = () => {
        // TODO: Implement report generation or view logic here
        console.log("Generating report...");
        alert("Report generated!");
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                User Dashboard
            </Typography>

            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Create New Blog Post
                </Typography>
                <Box component="form" onSubmit={handlePost}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Content"
                                fullWidth
                                multiline
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Post Blog
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {message && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Paper>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Generate Report
                </Typography>
                <Button variant="outlined" color="secondary" onClick={handleReport}>
                    Generate Report
                </Button>
            </Paper>
        </Container>
    );
}