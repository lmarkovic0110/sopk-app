"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function AuthStatus() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-[var(--primary)]">
          {user.nickname || user.name}
        </span>
        <a
          href="/api/auth/logout"
          className="text-xs text-[var(--muted)] hover:text-rose-500 transition-colors"
        >
          (Log out)
        </a>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/api/auth/login"
        className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface-soft)]"
      >
        Log in
      </Link>
      <Link
        href="/api/auth/login?screen_hint=signup"
        className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
      >
        Sign up
      </Link>
    </>
  );
}
