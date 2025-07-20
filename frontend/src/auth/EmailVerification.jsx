import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Paper,
    Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Token missing.");
            return;
        }

        let timeoutId;

        const verifyEmail = async () => {
            try {
                const response = await axios.get(
                    `/api/user/verify/${encodeURIComponent(token)}`
                );

                if (response.data.status) {
                    setStatus("success");
                    setMessage(response.data.body);

                    timeoutId = setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(response.data.body || "Invalid or expired link.");
                }
            } catch (error) {
                console.error(error);
                setStatus("error");
                setMessage("Something went wrong. Link may be expired or invalid.");
            }
        };

        verifyEmail();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [location.search, navigate]);

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
            }}
        >
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                {status === "loading" && (
                    <>
                        <CircularProgress />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Verifying your email...
                        </Typography>
                    </>
                )}

                {status === "success" && (
                    <>
                        <Typography variant="h5" gutterBottom color="success.main">
                            ✅ {message}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Redirecting to login page...
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login Now
                        </Button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <Typography variant="h5" gutterBottom color="error.main">
                            ❌ Verification Failed
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {message}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/")}
                        >
                            Go to Home
                        </Button>
                    </>
                )}
            </Paper>
        </Container>
    );
}
