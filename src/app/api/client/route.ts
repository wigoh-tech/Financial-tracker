import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { email, userName} = await req.json();

        if ( !email || !userName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Find the user by username
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Create client with user.id as foreign key
        const client = await prisma.client.create({
            data: {
                userId: user.id,
                email,
                userName, // Include the userName field as required
            },
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error: any) {
        console.error('Error registering client:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
