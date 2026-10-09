import { ApiError, api } from './client.ts'
import { API_URL } from './config.ts'

const respondWith = (body: unknown, status = 200) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(body), { status }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('api', () => {
  it('requests the path on the api address', async () => {
    const fetchSpy = respondWith({ ok: true })

    await expect(api('posts/')).resolves.toEqual({ ok: true })

    expect(fetchSpy.mock.calls[0][0]).toBe(`${API_URL}/posts/`)
  })

  it('passes the abort signal to the request', async () => {
    const fetchSpy = respondWith([])
    const { signal } = new AbortController()

    await api('posts/', { signal })

    expect(fetchSpy.mock.calls[0][1]).toEqual({ signal })
  })

  it('rejects with the status when the api answers with an error', async () => {
    respondWith({}, 500)

    const failure = api('posts/nope')

    await expect(failure).rejects.toBeInstanceOf(ApiError)
    await expect(failure).rejects.toMatchObject({ status: 500 })
  })
})
