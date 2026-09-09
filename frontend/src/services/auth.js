const TOKEN_KEY = 'justus_token'
const USER_KEY = 'justus_user'

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch (e) {}
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (e) {
    return null
  }
}

export function setUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch (e) {}
}

export function getUser() {
  try {
    const v = localStorage.getItem(USER_KEY)
    return v ? JSON.parse(v) : null
  } catch (e) {
    return null
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (e) {}
}

// Note: For production, prefer HTTP-only secure cookies for JWTs.
// This module centralizes token handling to allow switching to cookies later.
