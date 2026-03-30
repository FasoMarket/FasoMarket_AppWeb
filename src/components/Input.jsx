import { cn } from '../utils/cn';
import { AlertCircle } from 'lucide-react';

export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  pattern,
  maxLength,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-bold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        pattern={pattern}
        maxLength={maxLength}
        className={cn(
          'w-full px-4 py-2.5 border rounded-lg font-medium transition-all',
          'focus:ring-2 focus:ring-primary focus:border-transparent outline-none',
          error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
