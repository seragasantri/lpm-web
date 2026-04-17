import { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          className={`
            w-full px-4 py-2.5 border rounded-lg text-sm text-slate-700
            placeholder-slate-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-sky-400
            transition-all
            ${error
              ? 'border-red-300 focus:ring-red-300 focus:border-red-400'
              : 'border-slate-300 focus:border-sky-400'
            }
            ${props.disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'bg-white'}
          `}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;