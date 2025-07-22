import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Box,
    TextField,
    Paper,
    Chip,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

export default function HomePage() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate(); // ✅ INIT

    useEffect(() => {
        const fetchLatestBlogs = async () => {
            try {
                const res = await axios.get("/api/user/latest_blog");
                if (Array.isArray(res.data.body)) {
                    setBlogs(res.data.body);
                } else {
                    setBlogs([]);
                }
            } catch (err) {
                console.error(err);
                setBlogs([
                    {
                        id: 1,
                        title: "Top OWASP Vulnerabilities 2025",
                        image:
                            "https://miro.medium.com/v2/resize:fit:1400/1*fQQizxgxYkWwaRM42CikqA.png",
                        description:
                            "Explore the top OWASP vulnerabilities every ethical hacker must know. Understand the risks and how to mitigate them effectively.",
                    },
                    {
                        id: 2,
                        title: "How to Harden Your APIs",
                        image:
                            "https://miro.medium.com/v2/resize:fit:1400/1*LhOH1Q94VDgRxKJELCiZvg.png",
                        description:
                            "Learn practical steps to secure your RESTful APIs from attacks. Implement rate limiting, authentication, and encryption best practices.",
                    },
                    {
                        id: 3,
                        title: "Web App Pentesting Guide",
                        image:
                            "https://miro.medium.com/v2/resize:fit:1400/1*j0E7eFyfMQnV58V38DSHLQ.png",
                        description:
                            "Step-by-step guide to performing a penetration test on modern web apps. Tools, checklists, and real-world examples included.",
                    },
                ]);
            }
        };

        fetchLatestBlogs();
    }, []);

    const handleReadMore = (blogId) => {
        // ✅ If you want to redirect to ALL blogs page:
        navigate("/blog");

        // ✅ If you want to redirect to specific blog detail page:
        // navigate(`/blog/${blogId}`);
    };

    const truncate = (text) => {
        return text.length > 100 ? text.slice(0, 100) + "..." : text;
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
            {/* Hero */}
            <Box
                sx={{
                    textAlign: "center",
                    mb: 6,
                    p: 4,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                    color: "#fff",
                }}
            >
                <Typography variant="h2" gutterBottom>
                    SecureBlog
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Stay ahead with the latest cybersecurity techniques & tools.
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                        color: "#fff",
                        px: 4,
                        py: 1.5,
                        mt: 2,
                    }}
                >
                    Join the Community
                </Button>
            </Box>

            {/* Latest Blogs */}
            <Typography variant="h4" gutterBottom align="center">
                Latest Blogs
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    py: 2,
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {blogs.map((blog) => (
                    <Card
                        key={blog.id}
                        sx={{
                            minWidth: 300,
                            maxWidth: 300,
                            mx: 2,
                            flex: "0 0 auto",
                            borderRadius: 3,
                            boxShadow: 3,
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="200"
                            image={blog.image}
                            alt={blog.title}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                {blog.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {truncate(blog.description)}
                            </Typography>
                        </CardContent>
                        <Box sx={{ textAlign: "right", px: 2, pb: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleReadMore(blog.id)} // ✅ USE THIS
                            >
                                Read More
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Box>

            {/* Categories */}
            <Typography variant="h4" gutterBottom sx={{ mt: 8 }}>
                Popular Categories
            </Typography>
            <Box sx={{ mb: 6 }}>
                <Chip label="Web App Pentesting" sx={{ mr: 1, mb: 1 }} />
                <Chip label="API Security" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Cloud Security" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Tools & Techniques" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Vulnerability Research" sx={{ mr: 1, mb: 1 }} />
            </Box>

            {/* Newsletter */}
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    textAlign: "center",
                    mb: 6,
                    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                    color: "#fff",
                    borderRadius: 3,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    📧 Join Our Newsletter
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Get fresh security news, tips & tutorials in your inbox.
                </Typography>
                <Box
                    component="form"
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                >
                    <TextField
                        label="Your email"
                        variant="outlined"
                        sx={{ mr: 2, backgroundColor: "#fff", borderRadius: 1 }}
                    />
                    <Button variant="contained" sx={{ px: 3 }}>
                        Subscribe
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
