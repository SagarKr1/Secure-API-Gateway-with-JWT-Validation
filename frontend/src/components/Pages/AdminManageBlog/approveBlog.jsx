import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Avatar, Button, TextField
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function ApprovedBlogs({ refreshKey, triggerRefresh }) {
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
        fetchApprovedBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]); // ✅ refetch when refreshKey changes

    const fetchApprovedBlogs = async () => {
        try {
            const res = await axios.get('/api/user/approved_blog', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allBlogs = Array.isArray(res.data.body) ? res.data.body : [];

            // ✅ filter: admin’s & own blogs not shown
            const filtered = allBlogs.filter(blog =>
                blog.creator_role !== 'admin' && blog.creator_id !== loggedInUserId
            );
            setBlogs(filtered);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load approved blogs.');
            setBlogs([]);
        }
    };

    const handleRemarksChange = (id, value) => {
        setRemarks({ ...remarks, [id]: value });
    };

    const handleDisapprove = async (id) => {
        const remark = remarks[id] || '';
        try {
            await axios.put('/api/admin/approve_blog', {
                blog_id: id,
                is_verified: false,
                remarks: remark
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Blog ${id} disapproved!`);
            triggerRefresh(); // ✅ refresh parent & other tabs
        } catch (err) {
            console.error(err);
            toast.error('Failed to disapprove blog.');
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                            <TableCell colSpan={7} align="center">
                                No approved blogs found.
                            </TableCell>
                        </TableRow>
                    ) : blogs.map(blog => (
                        <TableRow key={blog.id}>
                            <TableCell>
                                <Avatar src={blog.image} variant="square" />
                            </TableCell>
                            <TableCell>{blog.title}</TableCell>
                            <TableCell>{blog.description}</TableCell>
                            <TableCell>{blog.is_verified ? "Yes" : "No"}</TableCell>
                            <TableCell>{blog.creator_name}</TableCell>
                            <TableCell>
                                <div>
                                    <div><strong>Current:</strong> {blog.remarks || "None"}</div>
                                    <TextField
                                        size="small"
                                        placeholder="Add new remarks"
                                        value={remarks[blog.id] || ''}
                                        onChange={(e) => handleRemarksChange(blog.id, e.target.value)}
                                        sx={{ mt: 1 }}
                                    />
                                </div>
                            </TableCell>
                            <TableCell>
                                {loggedInRole === 'admin' && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDisapprove(blog.id)}
                                    >
                                        Disapprove
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
