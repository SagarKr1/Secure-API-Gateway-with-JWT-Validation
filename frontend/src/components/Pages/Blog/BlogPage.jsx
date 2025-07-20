import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box,
} from "@mui/material";

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [expandedBlogId, setExpandedBlogId] = useState(null);

    useEffect(() => {
        const mockBlogs = [
            {
                id: 1,
                title: "Understanding Secure API Gateways",
                image: "https://www.practical-devsecops.com/wp-content/uploads/2023/02/API-gateway-diagram.png",
                content:
                    "Learn how to build a secure API gateway with authentication, authorization, and rate limiting. In this article, we will cover the architecture, implementation, and best practices to ensure your microservices remain protected from threats. We’ll also dive into JWT validation, IP throttling, and how to monitor usage effectively with modern tools like FastAPI, Redis, and Nginx.",
            },
            {
                id: 2,
                title: "Best Practices for JWT Authentication",
                image: "https://cdn.sanity.io/images/3jwyzebk/production/c098fa07deca1062e013d92cabba4ba7ec7e7f19-1584x988.png",
                content:
                    "This article explains best practices for implementing JWT-based authentication in your projects. We’ll discuss how to securely issue and validate tokens, manage token expiration, and handle refresh tokens. Additionally, learn how to integrate OAuth2 with JWT for scalable identity management in large distributed systems.",
            },
            {
                id: 3,
                title: "Rate Limiting Strategies for APIs",
                image: "https://cdn.sanity.io/images/3jwyzebk/production/57b3d8275f0ac20cb6560b5d4d84a31a544a5213-1584x943.png",
                content:
                    "Rate limiting is crucial for protecting your APIs from abuse and ensuring fair usage. In this guide, we explore various strategies such as fixed window, sliding window, and token bucket algorithms. You’ll learn how to implement rate limiting with Redis and integrate it seamlessly with your FastAPI or Flask gateway.",
            },
            {
                id: 4,
                title: "Understanding Secure API Gateways",
                image: "https://www.practical-devsecops.com/wp-content/uploads/2023/02/API-gateway-diagram.png",
                content:
                    "Learn how to build a secure API gateway with authentication, authorization, and rate limiting. In this article, we will cover the architecture, implementation, and best practices to ensure your microservices remain protected from threats. We’ll also dive into JWT validation, IP throttling, and how to monitor usage effectively with modern tools like FastAPI, Redis, and Nginx.",
            },
            {
                id: 5,
                title: "Best Practices for JWT Authentication",
                image: "https://cdn.sanity.io/images/3jwyzebk/production/c098fa07deca1062e013d92cabba4ba7ec7e7f19-1584x988.png",
                content:
                    "This article explains best practices for implementing JWT-based authentication in your projects. We’ll discuss how to securely issue and validate tokens, manage token expiration, and handle refresh tokens. Additionally, learn how to integrate OAuth2 with JWT for scalable identity management in large distributed systems.",
            },
            {
                id: 6,
                title: "Rate Limiting Strategies for APIs",
                image: "https://cdn.sanity.io/images/3jwyzebk/production/57b3d8275f0ac20cb6560b5d4d84a31a544a5213-1584x943.png",
                content:
                    "Rate limiting is crucial for protecting your APIs from abuse and ensuring fair usage. In this guide, we explore various strategies such as fixed window, sliding window, and token bucket algorithms. You’ll learn how to implement rate limiting with Redis and integrate it seamlessly with your FastAPI or Flask gateway.",
            },
        ];
        setBlogs(mockBlogs);
    }, []);

    const toggleReadMore = (id) => {
        setExpandedBlogId(expandedBlogId === id ? null : id);
    };

    const truncateContent = (content) => {
        return content.slice(0, 100) + "...";
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Blog
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {blogs.map((blog) => (
                    <Grid item xs={12} sm={8} md={8} key={blog.id}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                transition: "height 0.3s ease",
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
                                    {expandedBlogId === blog.id
                                        ? blog.content
                                        : truncateContent(blog.content)}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "flex-end" }}>
                                <Button size="small" onClick={() => toggleReadMore(blog.id)}>
                                    {expandedBlogId === blog.id ? "Read Less" : "Read More"}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
