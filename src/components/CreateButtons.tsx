"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

export default function CreateButtons({ label = "+ Create Quiz" }: { label?: string }) {
  const { user } = useUser();
  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];
  const canManage = roles.some(role => ['Admin', 'Organizator', 'Ugostitelj'].includes(role));

  if (!canManage) return null;

  return (
    <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105 transition-all">
      {label}
    </button>
  );
}
