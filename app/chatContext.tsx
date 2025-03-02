"use client"; // This is a client component
import React, { createContext, useState, useContext } from 'react';

export type IChatMessage = {
    user: string;
    message: string;
}

type IChatContext = [
    IChatMessage[],
    any,
    any,
    boolean,
    string,
];

const ChatContext = createContext<IChatContext>([
    [] as IChatMessage[],
    () => null,
    () => null,
    false,
    ''
]);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<IChatMessage[]>([] as IChatMessage[]);
    const [socket, setSocket] = useState<any>(undefined);
    const [socketStatus, setSocketStatus] = useState(false);
    const [user, setUser] = useState('');

    const connect = (userName: string) => {
        if (userName !== '') {
            setUser(userName);

            // Establish socket connection
            const socket = new WebSocket(`ws://localhost:8000/ws?user=${userName}`);
            setSocket(socket);

            // Update socket status to connected
            socket.onopen = () => {
                setSocketStatus(true);
            };

            // Append new message if received from other users
            socket.onmessage = (event) => {
                const msg: IChatMessage = JSON.parse(event.data) as IChatMessage;
                if (msg && msg.user !== user) {
                    setMessages(prevData => ([...prevData, msg]));
                }
            };

            // Close the WebSocket connection when done & update socket connection status
            socket.onclose = () => {
                setSocketStatus(false);
            };
        }
    }

    const sendMessage = (msg: IChatMessage) => {
        socket.send(JSON.stringify(msg));
    }

    return (
        <ChatContext.Provider value={[messages, sendMessage, connect, socketStatus, user]}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    return useContext(ChatContext);
}