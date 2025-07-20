import React from "react";
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

export default function EditUserDialog({ open, onClose, onEdit, user }) {
    const [formData, setFormData] = React.useState(user || {});

    React.useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.put("/api/admin/edit_user", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert("✅ User updated successfully");
                onEdit(); // ✅ Tell parent to refresh
                onClose();
            } else {
                alert(`❌ Failed: ${response.data.message || "Error updating user"}`);
            }
        } catch (err) {
            console.error("Error:", err);
            alert("❌ Something went wrong.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role || "user"}
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
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
