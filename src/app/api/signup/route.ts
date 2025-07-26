import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { SignupSchema } from './schema';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('This is my data', body);
    const result = SignupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Validation error',
          error: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const { email, username, password } = result.data;
    console.log(result.data);
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User Already Exists' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
      select: { id: true, username: true, email: true },
    });
    console.log('New user signup', newUser);
    return NextResponse.json({ message: 'User created Successfully', newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
