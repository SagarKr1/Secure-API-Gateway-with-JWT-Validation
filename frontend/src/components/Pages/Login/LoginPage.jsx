import React, { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    Paper,
    Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            navigate("/"); // Redirect to home or dashboard
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/user/login", { email, password });
            console.log(response)
            const token = response.data.body;
            console.log(token);
            sessionStorage.setItem("token", token);

            toast.success("Login successful!");

            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Login failed:", error);

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h4" gutterBottom align="center">
                    Welcome Back
                </Typography>
                <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
                    Please log in to your account
                </Typography>

                <Box component="form" onSubmit={handleLogin}>
                    <Stack spacing={3}>
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Link href="#" underline="hover" variant="body2" align="right">
                            Forgot password?
                        </Link>
                        <Button type="submit" variant="contained" size="large" fullWidth>
                            Login
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}
