import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('shahajjo_user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('shahajjo_token'))

  useEffect(() => {
    if (!token) {
      setUser(null)
      setToken(null)
    }
  }, [])

  async function login(credentials = {}) {
    const email = credentials.email || credentials.mobile || ''
    const password = credentials.password || credentials.pin || ''

    if (!email || !password) {
      setUser(null)
      setToken(null)
      return null
    }

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.token) {
        localStorage.setItem('shahajjo_token', data.token)
        localStorage.setItem('shahajjo_user', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return data.user
      }
    } catch (err) {
      console.warn('Authentication failed without demo fallback', err)
    }

    localStorage.removeItem('shahajjo_user')
    localStorage.removeItem('shahajjo_token')
    setUser(null)
    setToken(null)
    return null
  }

  function logout() {
    localStorage.removeItem('shahajjo_user')
    localStorage.removeItem('shahajjo_token')
    setUser(null)
    setToken(null)
  }

  return { user, token, login, logout }
}
