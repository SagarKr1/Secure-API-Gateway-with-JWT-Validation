import React from "react";
import { jwtDecode } from "jwt-decode";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import axios from "axios";

export default function CreateUserDialog({ open, onClose, onCreate }) {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const decoded = jwtDecode(token);

            const insertData = {
                ...formData,
                created_by: decoded.email,
            };

            const response = await axios.post("/api/admin/create_user", insertData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert("✅ User created successfully");
                onCreate(); // ✅ Tell parent to refresh
                onClose();
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    role: "user",
                });
            } else {
                alert(`❌ Failed: ${response.data.message || "Error creating user"}`);
            }
        } catch (err) {
            console.error("Error:", err);
            alert("❌ Something went wrong.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New User</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="subadmin">Subadmin</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
