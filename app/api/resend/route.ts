import { EmailTemplate } from '../../components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: any) {
    try {
        const body = await request.json();
        console.log(body);
        const { data, error } = await resend.emails.send({
            from: 'Real-Time Chat <onboarding@resend.dev>',
            to: [body['to']],
            subject: 'Real-Time Chat - Channel Invite',
            react: await EmailTemplate({
                from: body['from'],
                to: body['to'],
                channel: body['channel'],
                channelLink: body['channelLink']
            }),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}