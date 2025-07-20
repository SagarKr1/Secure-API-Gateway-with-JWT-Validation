import { Box } from '@mui/material'
import React from 'react'

export default function PageNotFound() {
    return (
        <>
            <Box
                sx={{
                    height: '60vh',
                    width: '80vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 'auto',
                    textAlign: 'center',
                    fontSize: '24px', // Optional: makes the text more prominent
                }}
            >
                404 | Page Not Found
            </Box>

        </>
    )
}