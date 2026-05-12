import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, label, hint, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-brand-navy mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'flex min-h-24 w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-base text-brand-navy placeholder-gray-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 focus-visible:border-brand-primary disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 resize-none',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-600">{hint}</p>
      )}
    </div>
  )
);
TextArea.displayName = 'TextArea';

export { TextArea, type TextAreaProps };
