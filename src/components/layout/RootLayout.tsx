import React from 'react';
import { extensionId } from '@/lib/config';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id={extensionId + '-app'} className="h-full">
      {children}
    </div>
  );
}
