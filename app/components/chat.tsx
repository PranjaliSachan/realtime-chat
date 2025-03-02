'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import ChatBox from './chatBox';

export default function Chat() {
    const client = new Ably.Realtime({ authUrl: '/api/ably' });

    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName='test'>
                <ChatBox />
            </ChannelProvider>
        </AblyProvider>
    );
}