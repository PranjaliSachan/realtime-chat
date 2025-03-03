"use client"
import dynamic from 'next/dynamic';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Chat = dynamic(() => import('../components/chat'), {
    ssr: false,
})

const Home = () => {
    const params = useSearchParams();

    return (
        <>
            <Chat queryParams={params} />
        </>
    );
}

export default withPageAuthRequired(Home);
