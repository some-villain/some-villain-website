import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  /** Heading level to render; defaults to h2. */
  as?: 'h1' | 'h2';
  /** Replaces the default heading size (text-3xl sm:text-4xl). */
  titleClassName?: string;
}

const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ eyebrow, title, as: Heading = 'h2', titleClassName, className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      {eyebrow && (
        <p className="font-display text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          'font-display font-semibold uppercase tracking-tight text-cream',
          titleClassName ?? 'text-3xl sm:text-4xl'
        )}
      >
        {title}
      </Heading>
    </div>
  )
);
SectionHeading.displayName = 'SectionHeading';

export { SectionHeading };
