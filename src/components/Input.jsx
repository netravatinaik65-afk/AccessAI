import React from 'react';

/**
 * Accessible Input Component
 * Adheres to WCAG labelling and visible focus states.
 */
export default function Input({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  autoComplete,
  className = '',
  ...props
}) {
  const inputId = id || name;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-base font-semibold text-slate-800 flex items-center justify-between"
        >
          <span>
            {label}
            {required && (
              <span className="text-rose-600 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </span>
          {required && (
            <span className="text-xs font-normal text-slate-500 sr-only">
              (required)
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`w-full px-4 py-3 text-base text-slate-900 bg-white border-2 rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-indigo-600 focus:border-indigo-600 ${
          error
            ? 'border-rose-600 focus:ring-rose-500 focus:border-rose-600'
            : 'border-slate-300 hover:border-slate-400'
        } ${className}`}
        {...props}
      />

      {helperText && !error && (
        <p id={helperId} className="text-sm text-slate-600">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm font-medium text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
