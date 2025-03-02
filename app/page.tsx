"use client";
import Link from 'next/link';

import { Button, Container, Typography, Grid, Paper } from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import CodeIcon from '@mui/icons-material/Code';

const Website = () => {
    return (
        <div className="v-[100vh] flex flex-col">
            <main className="flex-1 flex-col">
                <section className="flex flex-col text-center md:px-12 py-24 bg-zinc-50">
                    <Typography variant="h1" component="h1" className='text-zinc-950' gutterBottom>
                        Connect Instantly with Open-Source Chat.
                    </Typography>
                    <Typography className='text-zinc-900' variant="h6" component="h6" gutterBottom>
                        Powered by Next.js, Auth0, and Ably.io. Build your community today.
                    </Typography>
                    <div className='w-full flex flex-col md:flex-row justify-center items-center mt-4'>
                        <Button variant="contained" size="large" href="https://github.com/PranjaliSachan/realtime-chat">
                            View on GitHub <GitHubIcon className='ml-3 text-zinc-50' />
                        </Button>
                        <Link href="/chat" className='md:ml-8 mt-5 md:mt-0 px-6 py-2 font-semibold text-zinc-950 border-2 border-zinc-950 rounded'>
                            Try the Demo <RocketLaunchIcon className='ml-2 text-zinc-950' />
                        </Link>
                    </div>
                </section>

                <section className="py-18 bg-black">
                    <Container maxWidth="md">
                        <Typography className='text-zinc-50' variant="h2" component="h2" align="center" gutterBottom>
                            Key Features
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper className="p-8 text-center" elevation={3}>
                                    <SecurityIcon fontSize="large" color="primary" />
                                    <Typography variant="h6">Secure Authentication</Typography>
                                    <Typography variant="body2">Powered by Auth0 for seamless and secure login.</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper className="p-8 text-center" elevation={3}>
                                    <GroupIcon fontSize="large" color="primary" />
                                    <Typography variant="h6">Channels</Typography>
                                    <Typography variant="body2">Create and share channel link with peers.</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper className={"p-8 text-center"} elevation={3}>
                                    <CodeIcon fontSize="large" color="primary" />
                                    <Typography variant="h6">Open Source</Typography>
                                    <Typography variant="body2">Allowing you to customize and extend the app.</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </section>

                <section className="py-18 bg-zinc-50">
                    <Container maxWidth="md">
                        <Typography className='text-zinc-900' variant="h2" component="h2" align="center" gutterBottom>
                            Technology Stack
                        </Typography>
                        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: 4 }}>
                            <Grid item>
                                <img src="/next.svg" alt="Next.js" className="w-[250px] px-2 mx-4" />
                            </Grid>
                            <Grid item>
                                <img src="https://pages.okta.com/rs/855-QAH-699/images/email-main-template_auth0-by-okta-logo_black_279x127_3x.png" alt="Auth0" className="h-[80px] px-2 mx-4" />
                            </Grid>
                            <Grid item>
                                <img src="https://voltaire.ably.com/static/ably-logo-200721285a51085f43e8a849a85667bc.svg" alt="Ably" className="h-[60px] px-2 mx-4" />
                            </Grid>
                            <Grid item>
                                <img src="https://v4.material-ui.com/static/logo.png" alt="Material UI" className="h-[100px] px-2 mx-4" />
                            </Grid>
                        </Grid>
                    </Container>
                </section>

                <section className="py-18 bg-black">
                    <Container maxWidth="md">
                        <Typography className='text-zinc-50' variant="h2" component="h2" align="center" gutterBottom>
                            Get Started
                        </Typography>
                        <Typography className='text-zinc-50' variant="subtitle1" align="center" gutterBottom>
                            Clone the repository and follow the instructions to set up the application.
                        </Typography>
                        <div className='text-center mt-6'>
                            <Button variant="contained" color="primary" href="https://github.com/PranjaliSachan/realtime-chat">
                                GitHub Repository
                            </Button>
                        </div>
                    </Container>
                </section>
            </main>

            <footer className="w-[100%] h-[100px] bg-black border-t border-t-zinc-800 flex justify-center items-center">
                <a className='flex justify-center items-center grow text-zinc-400' href="https://github.com/PranjaliSachan" target="_blank" rel="noopener noreferrer">
                    Pranjali Sachan
                </a>
            </footer>
        </div>
    );
};

export default Website;