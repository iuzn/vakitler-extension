import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-md px-5', className)}>
      {children}
    </div>
  );
}
