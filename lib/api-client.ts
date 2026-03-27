const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const ApiClient = {
  async get(path: string, token?: string) {
    const authToken = token || localStorage.getItem('access_token')
    console.log('[ApiClient.get]', { path, hasToken: !!token, hasLocalStorage: !!localStorage.getItem('access_token'), authTokenShort: authToken?.slice(0, 30) + '...' })
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      }
    })
    if (!res.ok) throw new Error(`GET failed: ${res.status}`)
    return res.json()
  },

  async post(path: string, body?: unknown, token?: string) {
    const authToken = token || localStorage.getItem('access_token')
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`POST failed: ${res.status}`)
    return res.json()
  },

  async put(path: string, body?: unknown, token?: string) {
    const authToken = token || localStorage.getItem('access_token')
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`PUT failed: ${res.status}`)
    return res.json()
  },

  async delete(path: string, token?: string) {
    const authToken = token || localStorage.getItem('access_token')
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      }
    })
    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`)
    return res.json()
  }
}

export function getGoogleLoginUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`
}
