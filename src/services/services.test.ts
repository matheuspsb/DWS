import { ApiError } from './api.ts'
import { authorsService } from './authors.service.ts'
import { categoriesService } from './categories.service.ts'
import { postsService } from './posts.service.ts'

const respondWith = (body: unknown, status = 200) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(body), { status }))

const requestedUrl = (spy: ReturnType<typeof respondWith>) => String(spy.mock.calls[0][0])

afterEach(() => {
  vi.restoreAllMocks()
})

describe('services', () => {
  it('reads the api address from the environment', async () => {
    const fetchSpy = respondWith([])

    await postsService().getPosts()

    expect(requestedUrl(fetchSpy)).toBe(`${import.meta.env.VITE_API_URL}/posts/`)
  })

  it.each([
    ['posts', () => postsService().getPosts(), '/posts/'],
    ['a post', () => postsService().getPost('p1'), '/posts/p1'],
    ['authors', () => authorsService().getAuthors(), '/authors/'],
    ['an author', () => authorsService().getAuthor('a1'), '/authors/a1'],
    ['categories', () => categoriesService().getCategories(), '/categories/'],
    ['a category', () => categoriesService().getCategory('c1'), '/categories/c1'],
  ])('gets %s', async (_name, call, path) => {
    const fetchSpy = respondWith({ ok: true })

    await expect(call()).resolves.toEqual({ ok: true })
    expect(requestedUrl(fetchSpy).endsWith(path)).toBe(true)
  })

  it('passes the abort signal to the request', async () => {
    const fetchSpy = respondWith([])
    const { signal } = new AbortController()

    await postsService().getPosts({ signal })

    expect(fetchSpy.mock.calls[0][1]).toEqual({ signal })
  })

  it('rejects with the status when the api answers with an error', async () => {
    respondWith({}, 500)

    const failure = postsService().getPost('nope')

    await expect(failure).rejects.toBeInstanceOf(ApiError)
    await expect(failure).rejects.toMatchObject({ status: 500 })
  })
})
