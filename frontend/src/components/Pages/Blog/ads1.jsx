// src/components/Ads1.jsx
import React from "react";
import { Box } from "@mui/material";

export default function Ads1() {
    return (
        <Box
            sx={{
                backgroundColor: "#1976d2",
                height: "500px",
                width: "100%",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "48px",
                fontWeight: "bold",
                position: "sticky",
                top: "100px",
            }}
        >
            Ads
        </Box>
    );
}
