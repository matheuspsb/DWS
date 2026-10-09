import { useState } from 'react'
import type {
  FilterGroupData,
  FilterSelection,
} from '../../../components/organisms/FilterPanel/FilterPanel.tsx'
import { useAuthors } from '../../../hooks/useAuthors.ts'
import { useCategories } from '../../../hooks/useCategories.ts'
import { usePostFilters } from '../../../hooks/usePostFilters.ts'

export function usePostListFilters() {
  const { filters, updateFilters } = usePostFilters()
  const [draft, setDraft] = useState<FilterSelection | null>(null)
  const categories = useCategories()
  const authors = useAuthors()

  const categoryOptions = (categories.data ?? []).map(({ id, name }) => ({ id, label: name }))
  const authorOptions = (authors.data ?? []).map(({ id, name }) => ({ id, label: name }))
  const groups: FilterGroupData[] = [
    { id: 'category', title: 'Category', choices: categoryOptions },
    { id: 'author', title: 'Author', choices: authorOptions },
  ]
  const applied: FilterSelection = { category: filters.categories, author: filters.authors }

  const apply = ({ category = [], author = [] }: FilterSelection) => {
    setDraft(null)
    updateFilters({ categories: category, authors: author })
  }

  return {
    filters,
    updateFilters,
    groups,
    categoryOptions,
    authorOptions,
    applied,
    panelValue: draft ?? applied,
    setDraft,
    apply,
  }
}
