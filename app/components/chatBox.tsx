"use client"
import stringAvatar from "../helpers/avatar";
import RichTextEditor from "./editor";

import * as React from "react";

import { Avatar, Badge, Box, Button, Collapse, CssBaseline, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Toolbar, Tooltip, Typography } from "@mui/material";

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';

import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';

import { useChannel } from 'ably/react';
import { Message } from "ably";

const drawerWidth = 240;

type IChatMessage = {
    user: string;
    message: string;
}

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

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const ChatBox = ({ user, activeChannelName, updateActiveChannel }:
    {
        user: UserProfile | undefined, activeChannelName: string, updateActiveChannel: any
    }) => {

    const theme = useTheme();
    const [open, setOpen] = React.useState<boolean>(true);
    const [expandChannels, setExpandChannels] = React.useState<boolean>(true);
    // const [expandDirectMessages, setDirectMessages] = React.useState<boolean>(true);
    const [mainWidth, setMainWidth] = React.useState<number>(0);

    const [localChannels, setLocalChannels] = React.useState<string[]>([]);
    // const [localDirectMessages, setLocalDirectMessages] = React.useState<string[]>([]);
    const [receivedMessages, setMessages] = React.useState<any>([]);

    const mainRef = React.useRef<any>(null);
    const textEditorRef = React.useRef<any>(null);

    const handleDrawerToggle = () => {
        setOpen(!open);
        setExpandChannels(false);
    };

    const handleExpandChannels = () => {
        setExpandChannels(!expandChannels);
    };

    // const handleDirectMessages = () => {
    //     setDirectMessages(!expandDirectMessages);
    // };

    const { channel, ably } = useChannel(activeChannelName, (message: Message) => {
        const history = receivedMessages.slice(-199);
        setMessages([...history, message.data]);
    });

    const sendMessage = (val: string) => {
        const msg = {
            user: user?.nickname,
            message: val.trim(),
        } as IChatMessage;
        channel.publish({ name: activeChannelName, data: msg });
    }

    const isCurrUser = (val: string) => {
        return val === user?.nickname;
    }

    React.useEffect(() => {
        setMainWidth(mainRef.current.offsetWidth);
        textEditorRef.current.style.width = `${mainWidth}px`;
    }, [mainRef.current]);

    React.useEffect(() => {
        if (user && user.nickname) {
            setLocalChannels([...localChannels, user?.nickname])
        }
    }, [user])

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" className="border-b border-b-zinc-200" elevation={0} open={open} sx={{
                    backgroundColor: 'white'
                }}>
                    <Toolbar>
                        <div className="w-full flex flex-row">
                            <IconButton
                                aria-label="open drawer"
                                onClick={handleDrawerToggle}
                                edge="start"
                                sx={[
                                    {
                                        marginRight: 5,
                                        color: 'black'
                                    },
                                    open && { display: 'none' },
                                ]}
                            >
                                <MenuIcon />
                            </IconButton>
                            <div className="ml-auto">
                                <a href="/api/auth/logout">
                                    <Tooltip title="Logout">
                                        <IconButton edge="end">
                                            <LogoutIcon />
                                        </IconButton>
                                    </Tooltip>
                                </a>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <Paper elevation={0}>
                            <div className="flex flex-row justify-items-start items-center">
                                <Typography variant="h5" component="h5">Real-Time Chat</Typography>
                            </div>
                        </Paper>
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
                                <Tooltip title="Channels">
                                    <ForumIcon />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary="Channels" />
                            {expandChannels ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={expandChannels} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {localChannels.map((c, i) => (
                                    <ListItemButton key={i} onClick={ev => updateActiveChannel(c)} sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            {isCurrUser(c) ? (
                                                <StyledBadge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    variant="dot"
                                                >
                                                    <Avatar {...stringAvatar(activeChannelName)} />
                                                </StyledBadge>
                                            ) : (
                                                <Avatar {...stringAvatar(c)} />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={c} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>

                        {/* <ListItemButton onClick={handleDirectMessages}>
                            <ListItemIcon>
                                <Tooltip title="Direct Messages">
                                    <ChatBubbleOutline />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary="Direct Messages" />
                            {expandDirectMessages ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={expandDirectMessages} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {localDirectMessages.map((dm) => (
                                    <ListItemButton onClick={ev => updateActiveChannel(dm)} sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <Avatar {...stringAvatar(dm)} />
                                        </ListItemIcon>
                                        <ListItemText primary={dm} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse> */}

                    </List>
                </Drawer>
                <Box component="main" ref={mainRef} sx={{ flexGrow: 1, mx: 2, mt: 3, px: 0 }}>
                    {/* Header */}
                    <Toolbar className="border-b border-b-zinc-200" sx={{ mt: 6 }}>
                        <div className="w-full py-4 flex flex-row justify-items-start items-center">
                            {isCurrUser(activeChannelName) ? (
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                >
                                    <Avatar {...stringAvatar(activeChannelName)} />
                                </StyledBadge>
                            ) : (
                                <Avatar {...stringAvatar(activeChannelName)} />
                            )}
                            <div className="ml-3">
                                <Typography variant="h6">{activeChannelName}</Typography>
                            </div>
                        </div>
                    </Toolbar>
                    {/* Messages */}
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        {receivedMessages.map((m: any, i: any) => (
                            <div key={i}>
                                <Paper elevation={0}>
                                    <div className="w-full flex flex-row justify-items-start items-center">
                                        <div>
                                            <Avatar {...stringAvatar(m.user)} />
                                        </div>
                                        <div className="ml-3">
                                            <Typography component="div" dangerouslySetInnerHTML={{ __html: m.message }} />
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        ))}
                    </Stack>
                    {/* Editor */}
                    <div ref={textEditorRef} className="absolute bottom-5">
                        <RichTextEditor onUpdate={sendMessage} />
                    </div>
                </Box>
            </Box>
        </>
    );
}

export default ChatBox;
