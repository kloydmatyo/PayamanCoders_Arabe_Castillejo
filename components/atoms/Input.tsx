/**
 * Input Atom Component
 * Basic reusable input field
 */

import React from 'react'
import { InputProps } from '@/interfaces'

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
  const widthStyle = fullWidth ? 'w-full' : ''
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${errorStyles} ${disabledStyles} ${widthStyle} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
