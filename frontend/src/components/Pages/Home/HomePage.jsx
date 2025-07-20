import React from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";
import { Link } from "react-router-dom";

const latestBlogs = [
    {
        id: 1,
        title: "Understanding Secure API Gateways",
        snippet:
            "Learn how to build a secure API gateway with authentication, authorization, and rate limiting for modern microservices...",
        image:
            "https://www.practical-devsecops.com/wp-content/uploads/2023/02/API-gateway-diagram.png",
    },
    {
        id: 2,
        title: "JWT Authentication Best Practices",
        snippet:
            "Best practices for implementing secure JWT-based authentication in your apps, with tips for avoiding common pitfalls...",
        image:
            "https://cdn.sanity.io/images/3jwyzebk/production/c098fa07deca1062e013d92cabba4ba7ec7e7f19-1584x988.png",
    },
    {
        id: 3,
        title: "API Rate Limiting Demystified",
        snippet:
            "A deep dive into API rate limiting — why it matters, how to implement it, and tools you can use...",
        image:
            "https://cdn.sanity.io/images/3jwyzebk/production/57b3d8275f0ac20cb6560b5d4d84a31a544a5213-1584x943.png",
    },
];

export default function Home() {
    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 }, mb: 8 }}>
            {/* ✅ Hero */}
            <Grid
                container
                spacing={6}
                alignItems="center"
                justifyContent="center"
                direction={{ xs: "column-reverse", md: "row" }}
                textAlign={{ xs: "center", md: "left" }}
            >
                <Grid item xs={12} md={6}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            fontSize: { xs: "2rem", md: "3rem" },
                        }}
                    >
                        Your Hub for Secure API Insights
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                        Explore our curated articles on modern API security, best practices,
                        and real-world implementation tips.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        component={Link}
                        to="/blog"
                    >
                        Explore Blogs
                    </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="https://images.unsplash.com/photo-1664575592238-97845c8b5f06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                        alt="API Security"
                        sx={{
                            width: "100%",
                            borderRadius: 3,
                            boxShadow: 4,
                            display: "block",
                            mx: "auto",
                        }}
                    />
                </Grid>
            </Grid>

            {/* ✅ Latest Blogs */}
            <Box sx={{ mt: { xs: 6, md: 10 } }}>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    Latest Blogs
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {latestBlogs.map((blog) => (
                        <Grid item xs={12} sm={6} md={4} key={blog.id}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={blog.image}
                                    alt={blog.title}
                                />
                                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {blog.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        {blog.snippet}
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        component={Link}
                                        to="/blog"
                                    >
                                        Read More
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}
