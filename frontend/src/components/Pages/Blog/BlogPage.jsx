import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box,
} from "@mui/material";
import Ads1 from "./ads1";
import Ads2 from "./ads2";

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [expandedBlogId, setExpandedBlogId] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get("/api/user/approved_blog");
                if (res.data && Array.isArray(res.data.body)) {
                    setBlogs(res.data.body);
                } else {
                    setBlogs([]);
                    console.error("Unexpected API shape:", res.data);
                }
            } catch (error) {
                setBlogs([]);
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    const toggleReadMore = (id) => {
        setExpandedBlogId(expandedBlogId === id ? null : id);
    };

    const truncateDescription = (desc) => {
        if (!desc) return "No description available.";
        return desc.length > 150 ? desc.slice(0, 150) + "..." : desc;
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 2,
                }}
            >
                {/* Left Ad (Desktop Only) */}
                <Box
                    sx={{
                        width: { md: 220 },
                        display: { xs: "none", md: "block" },
                        position: "sticky",
                        top: 100,
                        borderRadius: 2,
                        boxShadow: 1,
                        overflow: "hidden",
                        bgcolor: "#fff",
                    }}
                >
                    <Box sx={{ p: 1 }}>
                        <Ads1 />
                    </Box>
                </Box>

                {/* Main Content */}
                <Box
                    sx={{
                        flex: 1,
                        maxWidth: "800px",
                        mx: "auto",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Blog
                    </Typography>

                    {/* Ads1 (Mobile View Only) */}
                    <Box
                        sx={{
                            display: { xs: "block", md: "none" },
                            width: "100%",
                            maxWidth: "100%",
                        }}
                    >
                        <Card sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: 200,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ads1 />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Blog Cards */}
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <Card key={blog.id} sx={{ width: "100%" }}>
                                {blog.image && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={blog.image}
                                        alt={blog.title || "Blog image"}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {blog.title || "Untitled Blog"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {expandedBlogId === blog.id
                                            ? blog.description || "No description available."
                                            : truncateDescription(blog.description)}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: "flex-end" }}>
                                    <Button size="small" onClick={() => toggleReadMore(blog.id)}>
                                        {expandedBlogId === blog.id ? "Read Less" : "Read More"}
                                    </Button>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography align="center">No blogs found.</Typography>
                    )}

                    {/* Ads2 (Mobile View Only) */}
                    <Box
                        sx={{
                            display: { xs: "block", md: "none" },
                            width: "100%",
                            maxWidth: "100%",
                        }}
                    >
                        <Card sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: 200,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ads2 />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Right Ad (Desktop Only) */}
                <Box
                    sx={{
                        width: { md: 220 },
                        display: { xs: "none", md: "block" },
                        position: "sticky",
                        top: 100,
                        borderRadius: 2,
                        boxShadow: 1,
                        overflow: "hidden",
                        bgcolor: "#fff",
                    }}
                >
                    <Box sx={{ p: 1 }}>
                        <Ads2 />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
