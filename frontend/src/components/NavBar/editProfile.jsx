import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid,
} from "@mui/material";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
    const [basicDetails, setBasicDetails] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [loading, setLoading] = useState(false);

    // ✅ Load user data from JWT
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setBasicDetails({
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                phone: decoded.phone,
            });
        }
    }, []);

    // ✅ Handle input changes
    const handleBasicChange = (e) => {
        setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // ✅ Submit updated basic profile
    const handleBasicSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            await axios.put(
                "/api/admin/profile",
                {
                    id: basicDetails.id,
                    name: basicDetails.name,
                    email: basicDetails.email,
                    phone: basicDetails.phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Submit password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");
            await axios.put(
                "/api/admin/change_password",
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Password changed successfully!");
            setPasswordData({ currentPassword: "", newPassword: "" });
        } catch (err) {
            console.error(err);
            toast.error("Error changing password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} />

            <Typography variant="h4" gutterBottom>
                Edit Profile
            </Typography>

            <Grid container spacing={4}>
                {/* ✅ Edit Basic Details */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Edit Basic Details
                        </Typography>
                        <Box component="form" onSubmit={handleBasicSubmit} noValidate>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Name"
                                name="name"
                                value={basicDetails.name}
                                onChange={handleBasicChange}
                                required
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={basicDetails.email}
                                onChange={handleBasicChange}
                                required
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={basicDetails.phone}
                                onChange={handleBasicChange}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Details"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* ✅ Change Password */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Change Password
                        </Typography>
                        <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="New Password"
                                name="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                {loading ? "Changing..." : "Change Password"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
