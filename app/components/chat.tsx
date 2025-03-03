'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import ChatBox from './chatBox';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ReadonlyURLSearchParams } from 'next/navigation';

export default function Chat({ queryParams }: { queryParams: ReadonlyURLSearchParams }) {
    const { user, isLoading, error } = useUser();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    const client = new Ably.Realtime({ authUrl: '/api/ably' });
    const [channel, setChannel] = useState(user?.nickname ?? 'test');

    const setActiveChannel = (val: string) => {
        setChannel(val);
    }

    useEffect(() => {
        if (user && user.nickname
            && queryParams
            && queryParams.get('referrer')
            && (queryParams.get('referrer') !== user.nickname)
            && queryParams.get('channel')) {
            setChannel(queryParams.get('channel') as string);
        }
    }, [queryParams]);

    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={channel}>
                <ChatBox user={user} activeChannelName={channel} updateActiveChannel={setActiveChannel} />
            </ChannelProvider>
        </AblyProvider>
    );
}