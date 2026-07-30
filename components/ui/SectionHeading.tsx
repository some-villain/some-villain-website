import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow: string;
  title: string;
}

const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ eyebrow, title, className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      <p className="font-display text-xs font-medium uppercase tracking-[0.3em] text-accent">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold uppercase tracking-tight text-cream sm:text-4xl">
        {title}
      </h2>
    </div>
  )
);
SectionHeading.displayName = 'SectionHeading';

export { SectionHeading };
