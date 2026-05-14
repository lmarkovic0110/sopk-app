import { handleAuth } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

const handler = handleAuth();

export const GET = async (req: NextRequest, { params }: { params: Promise<{ auth0: string }> }) => {
  const resolvedParams = await params;

  return handler(req, { params: resolvedParams } as any);
};
