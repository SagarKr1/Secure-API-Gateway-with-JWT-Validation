import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);
    const navigate = useNavigate();

    // Mobile nav
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Profile dropdown
    const handleProfileMenu = (event) => {
        setProfileMenuAnchor(event.currentTarget);
    };
    const handleProfileClose = () => {
        setProfileMenuAnchor(null);
    };

    // ✅ LOGOUT logic
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        handleProfileClose();
        navigate("/login");
        window.location.reload();
    };

    const pages = [
        { label: "Home", path: "/" },
        { label: "Blog", path: "/blog" },
    ];

    const getRolePages = () => {
        if (!user || !user.isAuthenticated) return [];
        switch (user.role) {
            case "admin":
            case "subadmin":
                return [
                    { label: "Admin Dashboard", path: "/admin-dashboard" },
                    { label: "Manage Users", path: "/manage-users" },
                ];
            case "user":
                return [{ label: "User Dashboard", path: "/dashboard" }];
            default:
                return [];
        }
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ justifyContent: "flex-end" }}>
                {/* Desktop */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                    {pages.map((page) => (
                        <Button
                            key={page.label}
                            component={Link}
                            to={page.path}
                            color="inherit"
                        >
                            {page.label}
                        </Button>
                    ))}

                    {getRolePages().map((page) => (
                        <Button
                            key={page.label}
                            component={Link}
                            to={page.path}
                            color="inherit"
                        >
                            {page.label}
                        </Button>
                    ))}

                    {user && user.isAuthenticated ? (
                        <>
                            <Button
                                color="inherit"
                                startIcon={<AccountCircle />}
                                onClick={handleProfileMenu}
                            >
                                Profile
                            </Button>
                            <Menu
                                anchorEl={profileMenuAnchor}
                                open={Boolean(profileMenuAnchor)}
                                onClose={handleProfileClose}
                            >
                                {[
                                    <MenuItem
                                        key="profile"
                                        component={Link}
                                        to="/profile"
                                        onClick={handleProfileClose}
                                    >
                                        Edit Profile
                                    </MenuItem>,
                                    <MenuItem
                                        key="report"
                                        component={Link}
                                        to="/report"
                                        onClick={handleProfileClose}
                                    >
                                        Report
                                    </MenuItem>,
                                    <MenuItem key="logout" onClick={handleLogout}>
                                        Logout
                                    </MenuItem>,
                                ]}
                            </Menu>
                        </>
                    ) : (
                        <Button component={Link} to="/login" color="inherit">
                            Login
                        </Button>
                    )}
                </Box>

                {/* Mobile */}
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                    <IconButton
                        size="large"
                        aria-label="menu"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        keepMounted
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {[...pages, ...getRolePages()].map((page) => (
                            <MenuItem
                                key={page.label}
                                component={Link}
                                to={page.path}
                                onClick={handleClose}
                            >
                                {page.label}
                            </MenuItem>
                        ))}

                        {user && user.isAuthenticated
                            ? [
                                <MenuItem
                                    key="profile-mobile"
                                    component={Link}
                                    to="/profile"
                                    onClick={handleClose}
                                >
                                    Edit Profile
                                </MenuItem>,
                                <MenuItem
                                    key="report-mobile"
                                    component={Link}
                                    to="/report"
                                    onClick={handleClose}
                                >
                                    Report
                                </MenuItem>,
                                <MenuItem
                                    key="logout-mobile"
                                    onClick={() => {
                                        handleClose();
                                        handleLogout();
                                    }}
                                >
                                    Logout
                                </MenuItem>,
                            ]
                            : [
                                <MenuItem
                                    key="login-mobile"
                                    component={Link}
                                    to="/login"
                                    onClick={handleClose}
                                >
                                    Login
                                </MenuItem>,
                            ]}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
