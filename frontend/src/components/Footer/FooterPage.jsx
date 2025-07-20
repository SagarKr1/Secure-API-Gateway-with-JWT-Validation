import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: "auto", // 👈 Push footer to bottom if content is short
                py: 2,
                px: 2,
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
                textAlign: "center",
                borderTop: "1px solid #ddd", // subtle top border for separation
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Secure API Gateway. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
