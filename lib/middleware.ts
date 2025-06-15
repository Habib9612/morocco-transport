import { NextRequest, NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function createApiError(statusCode: number, message: string) {
  return new ApiError(statusCode, message);
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Unknown error occurred' },
    { status: 500 }
  );
}

export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

export function validateRequiredFields(data: any, fields: string[]) {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw createApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createApiError(400, 'Invalid email format');
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    throw createApiError(400, 'Password must be at least 8 characters long');
  }
}
