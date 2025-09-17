import { ReactNode } from 'react';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-200 dark:bg-zinc-900">
      {children}
    </div>
  );
}
