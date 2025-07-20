import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Avatar, Button, TextField
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function PendingApproval() {
    const [blogs, setBlogs] = useState([]);
    const [remarks, setRemarks] = useState({});
    const token = sessionStorage.getItem('token');

    let loggedInUserId = '';
    let loggedInRole = '';

    try {
        if (token) {
            const decoded = jwtDecode(token);
            loggedInUserId = decoded.id;
            loggedInRole = decoded.role;
        }
    } catch (err) {
        console.error('JWT decode failed:', err);
    }

    useEffect(() => {
        fetchPendingBlogs();
    }, []);

    const fetchPendingBlogs = async () => {
        try {
            const res = await axios.get('/api/user/unapproved_blog', {
                headers: { Authorization: `Bearer ${token}` }
            });
            let allBlogs = Array.isArray(res.data.body) ? res.data.body : [];

            const filtered = allBlogs.filter(
                (blog) => blog.creator_role !== 'admin' && blog.creator_id !== loggedInUserId
            );

            setBlogs(filtered);

            // ✅ Do NOT show any toast when there are no blogs — normal case!
        } catch (err) {
            console.error(err);
            toast.error('Failed to load pending blogs.'); // ✅ Only show if API call fails!
        }
    };

    const handleRemarksChange = (id, value) => {
        setRemarks({ ...remarks, [id]: value });
    };

    const handleApprove = async (id) => {
        const remark = remarks[id] || '';
        if (!remark) {
            toast.error('Please add remarks before approving.');
            return;
        }

        try {
            await axios.put('/api/admin/approve_blog', {
                blog_id: id,
                is_verified: true,
                remarks: remark
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Blog ${id} approved!`);
            fetchPendingBlogs();
        } catch (err) {
            console.error(err);
            toast.error('Failed to approve blog.');
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Approved</TableCell>
                        <TableCell>Creator</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {blogs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No pending blogs found.</TableCell>
                        </TableRow>
                    ) : blogs.map(blog => (
                        <TableRow key={blog.id}>
                            <TableCell><Avatar src={blog.image} variant="square" /></TableCell>
                            <TableCell>{blog.title}</TableCell>
                            <TableCell>{blog.description}</TableCell>
                            <TableCell>{blog.is_verified ? "Yes" : "No"}</TableCell>
                            <TableCell>{blog.creator_name}</TableCell>
                            <TableCell>
                                <TextField
                                    size="small"
                                    placeholder="Add approval remarks"
                                    value={remarks[blog.id] || ''}
                                    onChange={(e) => handleRemarksChange(blog.id, e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                {loggedInRole === 'admin' && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={() => handleApprove(blog.id)}
                                    >
                                        Approve
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
