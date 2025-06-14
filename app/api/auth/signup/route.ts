import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  // Role validation: allow standard roles, ADMIN will be set internally for the first user.
  role: z.enum(['individual', 'carrier', 'company'], {
    errorMap: () => ({ message: "Invalid role. Must be one of: individual, carrier, company." })
  }),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    let { email, password, name, role, company, phone } = result.data; // Use let for role

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Determine role: First user is ADMIN, others take validated input role
    const userCount = await db.user.count();
    let finalRole;

    if (userCount === 0) {
      finalRole = 'ADMIN';
    } else {
      // Convert validated lowercase role to uppercase Prisma enum equivalent
      switch (role.toLowerCase()) {
        case 'individual':
          finalRole = 'INDIVIDUAL';
          break;
        case 'carrier':
          finalRole = 'CARRIER';
          break;
        case 'company':
          finalRole = 'COMPANY';
          break;
        default:
          // This case should ideally not be reached if Zod validation is correct
          return NextResponse.json({ error: 'Invalid role specified after validation' }, { status: 400 });
      }
    }

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: finalRole, // Use the determined finalRole
        company,
        phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company: true,
        phone: true,
        avatar: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
