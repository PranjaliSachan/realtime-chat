import Ably from "ably";

export const revalidate = 0;

export async function GET() {
    const client = new Ably.Rest(process.env.ABLY_API_KEY ?? '');
    const tokenRequestData = await client.auth.createTokenRequest({
        clientId: "ably-nextjs-demo",
    });
    return Response.json(tokenRequestData);
}
