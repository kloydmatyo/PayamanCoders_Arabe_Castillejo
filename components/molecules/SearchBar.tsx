/**
 * SearchBar Molecule Component
 * Search input with filters
 */

import React, { useState } from 'react'
import { Input, Button } from '@/components/atoms'
import { SearchBarProps } from '@/interfaces'

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  showFilters = false,
  filters,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>

      {showFilters && filters && (
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <div key={filter.name} className="flex-1 min-w-[200px]">
              {filter.type === 'select' ? (
                <select
                  value={filter.value || ''}
                  onChange={(e) => onFilterChange?.(filter.name, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={filter.type}
                  placeholder={filter.label}
                  value={filter.value || ''}
                  onChange={(e) => onFilterChange?.(filter.name, e.target.value)}
                  fullWidth
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
