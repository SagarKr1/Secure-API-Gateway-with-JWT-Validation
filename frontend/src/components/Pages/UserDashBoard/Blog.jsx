import React, { useEffect, useState } from 'react';
import {
    Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Avatar, Modal, Box, TextField
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MyUserBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        blog_id: '',
        title: '',
        image: '',
        description: ''
    });

    const token = sessionStorage.getItem('token');
    let creator_id = '';

    try {
        if (token) {
            const decoded = jwtDecode(token);
            creator_id = decoded.id;
        }
    } catch (err) {
        console.error('JWT decode failed:', err);
    }

    const handleOpen = () => {
        setIsEditing(false);
        setFormData({ blog_id: '', title: '', image: '', description: '' });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const fetchBlogs = async () => {
        if (!creator_id) return;

        try {
            const res = await axios.get(`/api/admin/user_blog/${creator_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(res.data.body)) {
                setBlogs(res.data.body);
            } else {
                setBlogs([]);
            }
        } catch (err) {
            console.error(err);
            setBlogs([]);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [creator_id, token]);

    const handleCreate = async () => {
        try {
            await axios.post('/api/admin/create_blog', {
                creator_id,
                title: formData.title,
                image: formData.image,
                description: formData.description,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Blog created successfully!');
            fetchBlogs();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error('Failed to create blog.');
        }
    };

    const handleEdit = (blog) => {
        setIsEditing(true);
        setFormData({
            blog_id: blog.id,
            title: blog.title,
            image: blog.image,
            description: blog.description
        });
        setOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put('/api/admin/edit_blog', {
                blog_id: formData.blog_id,
                creator_id,
                title: formData.title,
                image: formData.image,
                description: formData.description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Blog updated successfully!');
            fetchBlogs();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update blog.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await axios.delete(`/api/admin/delete_blog/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Blog deleted.');
            fetchBlogs();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete blog.');
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>
                Add New Blog
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Approved</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No blogs found.</TableCell>
                            </TableRow>
                        ) : (
                            blogs.map(blog => (
                                <TableRow key={blog.id}>
                                    <TableCell>
                                        {blog.image ? <Avatar src={blog.image} variant="square" /> : 'No Image'}
                                    </TableCell>
                                    <TableCell>{blog.title}</TableCell>
                                    <TableCell>{blog.description}</TableCell>
                                    <TableCell>{blog.approved ? "Yes" : "No"}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" size="small" onClick={() => handleEdit(blog)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{ ml: 1 }}
                                            onClick={() => handleDelete(blog.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextField
                        label="Image URL"
                        fullWidth
                        margin="normal"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={isEditing ? handleUpdate : handleCreate}
                    >
                        {isEditing ? 'Update Blog' : 'Create Blog'}
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
