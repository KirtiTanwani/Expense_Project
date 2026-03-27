import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.role === 'USER') {
      return NextResponse.json({ error: 'Unauthorized Access. Standard users are no longer allowed.' }, { status: 403 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSession({
      userId: user.id,
      role: user.role,
      projectId: user.projectId,
    });

    return NextResponse.json({
      message: 'Logged in',
      role: user.role.toLowerCase(),
    });
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
