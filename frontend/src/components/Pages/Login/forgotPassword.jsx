import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address!");
            return;
        }

        try {
            setLoading(true);
            await axios.put("/api/user/forgot_password", { email });
            toast.success("New password sent to your mail. Please check and use it!");

            setEmail(""); // ✅ Clear field

            // ✅ Wait 2.5 seconds then redirect
            setTimeout(() => {
                navigate("/login");
            }, 2500);
        } catch (err) {
            console.error(err);
            toast.error("Error sending new password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <ToastContainer position="top-right" autoClose={2500} />
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Forgot Password
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Enter your registered email — we’ll send you a new password.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Sending..." : "Send New Password"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
