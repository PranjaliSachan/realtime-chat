/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable  @next/next/no-html-link-for-pages */
"use client"
import stringAvatar from "../helpers/avatar";
import RichTextEditor from "./editor";

import * as React from "react";

import {
    Avatar,
    Badge,
    Box,
    Button,
    Collapse,
    CssBaseline,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    SnackbarContent,
    Popover
} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { AddBox, ExpandLess, ExpandMore, Share } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import ForumIcon from '@mui/icons-material/Forum';
// import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';

import { UserProfile } from '@auth0/nextjs-auth0/client';

import { useChannel } from 'ably/react';
import { Message } from "ably";
import { grey, lightGreen } from "@mui/material/colors";

const drawerWidth = 240;

type IChatMessage = {
    user: string;
    message: string;
}

type IMessageHistory = {
    channel: string;
    messages: IChatMessage[],
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
    const [localMessageHistory] = React.useState<IMessageHistory[]>([]);

    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
    const [newChannelName, setNewChannelName] = React.useState<string>('');

    const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');

    const [linkPopoverOpen, setLinkPopoverOpen] = React.useState<boolean>(false);
    const [shareLinkEmailAddress, setShareLinkEmailAddress] = React.useState<string>('');

    const mainRef = React.useRef<any>(null);
    const textEditorRef = React.useRef<any>(null);
    const linkRef = React.useRef<HTMLDivElement>(null);

    const handleDrawerToggle = () => {
        setOpen(!open);
        setExpandChannels(false);
    };

    const handleExpandChannels = () => {
        if (open) {
            setExpandChannels(!expandChannels);
        }
    };

    // const handleDirectMessages = () => {
    //     setDirectMessages(!expandDirectMessages);
    // };

    const { channel } = useChannel(activeChannelName, (message: Message) => {
        const localHistory = localMessageHistory.filter((h: IMessageHistory) => h.channel === activeChannelName);
        let history = [] as IChatMessage[];
        if (localHistory.length > 0) {
            history = localHistory[0].messages.slice(-199);
            localHistory[0].messages.push(message.data);
        } else {
            localMessageHistory.push({
                channel: activeChannelName,
                messages: [message.data],
            });
        }
        // const history = receivedMessages.slice(-199);
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

    const handleUpdateActiveChannel = (ch: string) => {
        updateActiveChannel(ch);
        const localHistory = localMessageHistory.filter((h: IMessageHistory) => h.channel === ch);
        if (localHistory.length > 0) {
            const history = localHistory[0].messages.slice(-199);
            setMessages(history);
        } else {
            setMessages([]);
        }
    }

    const handleCreateNewChannel = () => {
        setDialogOpen(false);
        setLocalChannels([...localChannels, newChannelName]);
        handleSnackbarOpen('Channel Created!');
        setNewChannelName('');
    }

    const shareChannelLinkAndCopyToClipBoard = async () => {
        setLinkPopoverOpen(false);
        const errorMessage = 'Unable to share link at this moment. The link has been copied to clipboard! Please share the link manually or try again later!';
        try {
            let host = '';
            if (window.location.href.indexOf('?') >= 0) {
                host = window.location.href.split('?')[0];
            } else {
                host = window.location.href;
            }
            await navigator.clipboard.writeText(host + `?channel=${activeChannelName}&referrer=${user?.nickname}`);
            handleSnackbarOpen('Channel link copied to clipboard!');

            const response = await fetch('/api/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: user?.nickname,
                    to: shareLinkEmailAddress,
                    channel: activeChannelName,
                    channelLink: host + `?channel=${activeChannelName}&referrer=${user?.nickname}`
                }),
            });

            if (response.ok) {
                // Handle success (e.g., clear form, show success message)
                handleSnackbarOpen(`Link Sent to ${shareLinkEmailAddress}!`);
                setShareLinkEmailAddress('');
            } else {
                console.error('Error sending channel link');
                // Handle error (e.g., show error message)
                handleSnackbarOpen(errorMessage);
            }
        } catch (error) {
            console.error('Network error:', error);
            handleSnackbarOpen(errorMessage);
        }
    }

    const handleSnackbarOpen = (msg: string) => {
        setOpenSnackbar(true);
        setSnackbarMessage(msg);
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        setSnackbarMessage('');
    }

    React.useEffect(() => {
        setMainWidth(mainRef.current.offsetWidth);
        textEditorRef.current.style.width = `${mainWidth}px`;
    }, [mainWidth, mainRef]);

    React.useEffect(() => {
        if (user && user.nickname) {
            if (localChannels.indexOf(user.nickname) < 0) {
                setLocalChannels([...localChannels, user?.nickname]);
            }
        }
        if (localChannels.indexOf(activeChannelName) < 0) {
            setLocalChannels([...localChannels, activeChannelName]);
        }
    }, [user, activeChannelName, localChannels])

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
                        <ListItemButton onClick={e => setDialogOpen(true)}>
                            <ListItemIcon>
                                <Tooltip title="Create Channel">
                                    <AddBox />
                                </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary="Create Channel" />
                        </ListItemButton>
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
                                    <ListItemButton key={i} onClick={ev => handleUpdateActiveChannel(c)} sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            {isCurrUser(c) ? (
                                                <StyledBadge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    variant="dot"
                                                >
                                                    <Avatar {...stringAvatar(c)} />
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
                            {!isCurrUser(activeChannelName) ? (
                                <div ref={linkRef} className="ml-auto mr-3">
                                    <Tooltip title="Share Channel Link">
                                        <IconButton onClick={e => setLinkPopoverOpen(true)}>
                                            <Share />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            ) : (<></>)}
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
                                        <div className="ml-3 flex flex-col justify-center items-start">
                                            <Typography variant="subtitle2">{m.user}</Typography>
                                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: m.message }} />
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

            <Dialog
                open={dialogOpen}
            >
                <DialogTitle>Create Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for the channel
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="channelName"
                        label="Channel Name"
                        type="text"
                        sx={{ width: '400px' }}
                        variant="standard"
                        value={newChannelName}
                        onChange={e => setNewChannelName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={e => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" type="button" onClick={e => handleCreateNewChannel()}>Create</Button>
                </DialogActions>
            </Dialog>

            <Popover
                open={linkPopoverOpen}
                anchorEl={linkRef.current}
                onClose={e => setLinkPopoverOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className="flex flex-col justify-center items-start px-6 py-8 w-[400px]">
                    <Typography variant="h6" component="h6">Share Channel Link</Typography>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="email"
                        label="Enter Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={shareLinkEmailAddress}
                        onChange={e => setShareLinkEmailAddress(e.target.value)}
                    />
                    <Button variant="contained" type="button" onClick={shareChannelLinkAndCopyToClipBoard}>Send</Button>
                </div>

            </Popover>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openSnackbar}
                onClose={handleSnackbarClose}
                autoHideDuration={3000}
            >
                <SnackbarContent style={{ backgroundColor: lightGreen[200], color: grey[900] }} message={snackbarMessage} />
            </Snackbar>
        </>
    );
}

export default ChatBox;
