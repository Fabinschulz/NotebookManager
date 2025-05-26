'use client';

import { cn } from '@/utils';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

type RefreshProgressProps = {
  value?: number;
  className?: string;
};

function RefreshProgress({ value = 0, className }: RefreshProgressProps) {
  const [progress, setProgress] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProgressPrimitive.Root
      data-testid="progress"
      className={cn('relative h-2 w-full mx-auto overflow-hidden rounded-full bg-gray-200 my-5', className)}
      value={progress}
    >
      <ProgressPrimitive.Indicator
        data-testid="progress-indicator"
        className="h-full bg-[#006e89] transition-transform duration-500"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { RefreshProgress };
