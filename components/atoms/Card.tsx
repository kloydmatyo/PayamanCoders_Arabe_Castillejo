/**
 * Card Atom Component
 * Basic reusable card container
 */

import React from 'react'
import { CardProps } from '@/interfaces'

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}) => {
  const baseStyles = 'rounded-lg transition-all duration-200'
  
  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border-2 border-gray-300',
    flat: 'bg-gray-50',
  }
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }
  
  const hoverStyles = hover ? 'hover:shadow-lg cursor-pointer' : ''
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
