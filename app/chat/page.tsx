"use client"
import * as React from "react";
import { Avatar, Box, Collapse, CssBaseline, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import stringAvatar from "../helpers/avatar";


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function Chat() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [expandChannels, setExpandChannels] = React.useState(true);
    const [expandDirectMessages, setDirectMessages] = React.useState(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleExpandChannels = () => {
        setExpandChannels(!expandChannels);
    };

    const handleDirectMessages = () => {
        setDirectMessages(!expandDirectMessages);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            edge="start"
                            sx={[
                                {
                                    marginRight: 5,
                                },
                                open && { display: 'none' },
                            ]}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerToggle}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        component="nav"
                    >
                        <ListItemButton onClick={handleExpandChannels}>
                            <ListItemIcon>
                                <ForumIcon />
                            </ListItemIcon>
                            <ListItemText primary="Channels" />
                            {expandChannels ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={expandChannels} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <Avatar {...stringAvatar('Gamers')} />
                                    </ListItemIcon>
                                    <ListItemText primary="Gamers" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        <ListItemButton onClick={handleDirectMessages}>
                            <ListItemIcon>
                                <ChatBubbleOutline />
                            </ListItemIcon>
                            <ListItemText primary="Direct Messages" />
                            {expandDirectMessages ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={expandDirectMessages} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <Avatar {...stringAvatar('John Doe')} />
                                    </ListItemIcon>
                                    <ListItemText primary="John Doe" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <div>Channel Messages</div>
                </Box>
            </Box>
        </>
    );
}
