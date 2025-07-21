// Blog/BlogCard.jsx
import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@mui/material";

export default function BlogCard({ blog, expandedId, toggleReadMore }) {
    const truncateContent = (content) => {
        if (content.length <= 100) return content;
        return content.slice(0, 100) + "...";
    };

    return (
        <Card
            sx={{
                width: "100%", // ✅ Makes card full width inside Grid
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                boxShadow: 3,
                borderRadius: 2,
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
                    {expandedId === blog.id
                        ? blog.content
                        : truncateContent(blog.content)}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button size="small" onClick={() => toggleReadMore(blog.id)}>
                    {expandedId === blog.id ? "Read Less" : "Read More"}
                </Button>
            </CardActions>
        </Card>
    );
}
