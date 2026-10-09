import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import RecentSearchesProvider from '../context/RecentSearchesProvider.tsx'

export function renderWithProviders(ui: ReactElement, route = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <QueryClientProvider client={queryClient}>
      <RecentSearchesProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </RecentSearchesProvider>
    </QueryClientProvider>,
  )
}
