import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import type { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

const handler = handleAuth({
  login: handleLogin((req) => {
    const href =
      typeof (req as NextRequest).url === 'string'
        ? (req as NextRequest).url
        : `http://local${(req as NextApiRequest).url ?? ''}`;
    const screenHint = new URL(href).searchParams.get('screen_hint');
    return {
      authorizationParams: {
        prompt: 'login',
        ...(screenHint ? { screen_hint: screenHint } : {}),
      },
    };
  }),
});

export const GET = async (req: NextRequest, { params }: { params: Promise<{ auth0: string }> }) => {
  const resolvedParams = await params;

  return handler(req, { params: resolvedParams } as any);
};
