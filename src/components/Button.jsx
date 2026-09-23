import React from 'react';

/**
 * Accessible Button Component
 * Features high contrast, prominent focus indicators, and flexible variants.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3.5 text-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-indigo-700 text-white hover:bg-indigo-800 active:bg-indigo-900 shadow-sm',
    secondary:
      'bg-slate-800 text-white hover:bg-slate-900 active:bg-black shadow-sm',
    outline:
      'border-2 border-slate-700 text-slate-800 bg-white hover:bg-slate-100 active:bg-slate-200',
    subtle:
      'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200',
    ghost:
      'text-slate-700 hover:bg-slate-100 active:bg-slate-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
