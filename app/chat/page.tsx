"use client"
import dynamic from 'next/dynamic';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const Chat = dynamic(() => import('../components/chat'), {
    ssr: false,
})

const Home = () => {
    return (
        <>
            <Chat />
        </>
    );
}

export default withPageAuthRequired(Home);
