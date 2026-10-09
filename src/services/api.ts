const baseUrl = import.meta.env.VITE_API_URL

export interface RequestOptions {
  signal?: AbortSignal
}

export class ApiError extends Error {
  readonly status: number

  constructor(path: string, status: number) {
    super(`Request to ${path} failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function api<T>(path: string, { signal }: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${baseUrl}/${path}`, { signal })
  if (!response.ok) throw new ApiError(path, response.status)
  return response.json() as Promise<T>
}
