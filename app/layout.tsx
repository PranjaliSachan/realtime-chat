import "./globals.css";
import { ChatProvider } from "./chatContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real-Time Chat Application",
  description: "Real-time, open-source chat application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </head>
        <UserProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </UserProvider>
      </html>
    </ChatProvider>
  );
}
