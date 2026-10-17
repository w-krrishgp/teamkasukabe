import { forwardRef } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, helperText, errorMessage, iconLeft, iconRight, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-harvest-deep select-none">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-harvest-muted">
              {iconLeft}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-11 px-3.5 py-2 text-sm text-harvest-deep bg-white border rounded-xl placeholder:text-harvest-muted/60',
              'transition duration-150 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-harvest-primary/20 focus:border-harvest-primary',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-harvest-border hover:border-harvest-sage/80',
              props.disabled && 'bg-harvest-warm/50 opacity-60 cursor-not-allowed',
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-harvest-muted">
              {iconRight}
            </div>
          )}
        </div>
        {errorMessage ? (
          <p className="text-xs font-medium text-red-600 animate-fadeIn">{errorMessage}</p>
        ) : helperText ? (
          <p className="text-xs text-harvest-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';

export interface SearchInputProps extends Omit<FormInputProps, 'iconLeft'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search crops, mandis, schemes...', ...props }, ref) => {
    return (
      <FormInput
        ref={ref}
        type="search"
        placeholder={placeholder}
        iconLeft={<Search className="w-4 h-4 text-harvest-muted" />}
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options: { label: string; value: string | number }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, helperText, errorMessage, options, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-harvest-deep select-none">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          className={cn(
            'w-full h-11 px-3.5 py-2 text-sm text-harvest-deep bg-white border rounded-xl appearance-none cursor-pointer',
            'transition duration-150 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-harvest-primary/20 focus:border-harvest-primary',
            hasError
              ? 'border-red-500 focus:border-red-500'
              : 'border-harvest-border hover:border-harvest-sage/80',
            props.disabled && 'bg-harvest-warm/50 opacity-60 cursor-not-allowed',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errorMessage ? (
          <p className="text-xs font-medium text-red-600">{errorMessage}</p>
        ) : helperText ? (
          <p className="text-xs text-harvest-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
FormSelect.displayName = 'FormSelect';

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, helperText, errorMessage, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-harvest-deep select-none">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'w-full min-h-[90px] px-3.5 py-2.5 text-sm text-harvest-deep bg-white border border-harvest-border rounded-xl',
            'focus:outline-none focus:ring-2 focus:ring-harvest-primary/20 focus:border-harvest-primary',
            errorMessage && 'border-red-500',
            className
          )}
          {...props}
        />
        {errorMessage && <p className="text-xs font-medium text-red-600">{errorMessage}</p>}
        {helperText && !errorMessage && <p className="text-xs text-harvest-muted">{helperText}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = 'FormTextarea';
