import * as React from 'react';

interface EmailTemplateProps {
    from: string;
    to: string;
    channel: string;
    channelLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    from, to, channel, channelLink
}) => (
    <div>
        <div><span>Hi!</span></div>
        <br />
        <p>
            {from} is inviting you to join <a href={channelLink}>{channel}</a> Channel on Real-Time Chat.
            <br />
            Use this <a href={channelLink}>Channel Link</a> to join {channel}.
        </p>
        <br />
        <div><span>Team Real-Time Chat</span></div>
        <br />
        <br />
        <small>This email is sent using <a href="https://resend.com">Resend</a></small>
    </div>
);
