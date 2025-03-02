'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import ChatBox from './chatBox';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Chat() {
    const { user, isLoading, error } = useUser();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    const client = new Ably.Realtime({ authUrl: '/api/ably' });
    const [channel, setChannel] = useState(user?.nickname ?? 'test');

    const setActiveChannel = (val: string) => {
        setChannel(val);
    }

    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={channel}>
                <ChatBox user={user} activeChannelName={channel} updateActiveChannel={setActiveChannel} />
            </ChannelProvider>
        </AblyProvider>
    );
}