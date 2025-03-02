'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import ChatBox from './chatBox';
import { useState } from 'react';

export default function Chat() {
    const client = new Ably.Realtime({ authUrl: '/api/ably' });
    const [channel, setChannel] = useState('test');

    const setActiveChannel = (val: string) => {
        setChannel(val);
    }

    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={channel}>
                <ChatBox activeChannelName={channel} updateActiveChannel={setActiveChannel} />
            </ChannelProvider>
        </AblyProvider>
    );
}