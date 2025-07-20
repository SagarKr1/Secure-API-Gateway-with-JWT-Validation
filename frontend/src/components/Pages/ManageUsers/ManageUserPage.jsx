import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CreateUserDialog from "./CreateUser";
import EditUserDialog from "./EditUser";
import { jwtDecode } from "jwt-decode";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const token = sessionStorage.getItem("token");
    const currentUser = token ? jwtDecode(token) : null;
    const currentEmail = currentUser?.email;

    // ✅ Reusable fetchUsers function
    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/admin/get_all_users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                const allUsers = response.data.body || [];
                const filteredUsers = allUsers.filter((u) => u.email !== currentEmail);
                setUsers(filteredUsers);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token, currentEmail]);

    const handleCreateUser = () => {
        setIsCreateOpen(true);
    };

    const handleEdit = (id) => {
        const user = users.find((u) => u.id === id);
        setSelectedUser(user);
        setIsEditOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`/api/admin/delete_user`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { id: id }, // ✅ Pass ID in request body
            });

            alert("User deleted");
            fetchUsers(); // ✅ Re-fetch updated list
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user");
        }
    };


    const handleCreate = () => {
        setIsCreateOpen(false);
        fetchUsers(); // ✅ Refresh list
    };

    const handleEditSave = () => {
        setIsEditOpen(false);
        fetchUsers(); // ✅ Refresh list
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    mb: 2,
                    gap: 2,
                }}
            >
                <Typography variant="h4">Manage Users</Typography>
                <Button variant="contained" onClick={handleCreateUser}>
                    Create User
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell sx={{ wordBreak: "break-word" }}>{user.id}</TableCell>
                                <TableCell sx={{ wordBreak: "break-word" }}>{user.name}</TableCell>
                                <TableCell sx={{ wordBreak: "break-word" }}>{user.email}</TableCell>
                                <TableCell sx={{ wordBreak: "break-word" }}>{user.phone}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEdit(user.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <CreateUserDialog
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
            />

            <EditUserDialog
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onEdit={handleEditSave}
                user={selectedUser}
            />
        </Container>
    );
}
