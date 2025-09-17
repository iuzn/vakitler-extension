import React from 'react';
import { WithChildren } from '@/types/common';

export default function Layout({ children }: WithChildren) {
  return (
    <>
      <main className="relative h-full flex-1 overflow-hidden">{children}</main>
    </>
  );
}
