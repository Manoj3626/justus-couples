import { getToken } from './auth'

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin.includes('netlify.app') || origin.includes('justus.in')) {
      return 'https://diary-twin-ministries-cakes.trycloudflare.com/api'
    }
  }
  return '/api'
}

const API_BASE = getApiBase()

export async function apiFetch(path, opts = {}) {
  const headers = opts.headers ? { ...opts.headers } : {}
  const token = getToken()

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(opts.body)
  }

  const res = await fetch(API_BASE + path, {
    ...opts,
    headers,
    credentials: 'include',
  })

  if (res.status === 401) {
    try {
      window.dispatchEvent(new Event('justus:unauthorized'))
    } catch (e) {}
    const data = await res.json().catch(() => null)
    const msg = data && data.message ? data.message : 'Unauthorized'
    throw new Error(msg)
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data && data.message ? data.message : (data && data.errors && data.errors[0]?.msg) || 'Request failed'
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export default apiFetch
