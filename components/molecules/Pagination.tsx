/**
 * Pagination Molecule Component
 * Pagination controls
 */

import React from 'react'
import { Button } from '@/components/atoms'
import { PaginationProps } from '@/interfaces'

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const halfMax = Math.floor(maxPageNumbers / 2)
    
    let startPage = Math.max(1, currentPage - halfMax)
    let endPage = Math.min(totalPages, currentPage + halfMax)
    
    if (currentPage <= halfMax) {
      endPage = Math.min(totalPages, maxPageNumbers)
    }
    
    if (currentPage + halfMax >= totalPages) {
      startPage = Math.max(1, totalPages - maxPageNumbers + 1)
    }
    
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push('...')
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {showPageNumbers && (
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'number' ? (
                <Button
                  variant={page === currentPage ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ) : (
                <span className="px-2 py-1 text-gray-500">{page}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}
