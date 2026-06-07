import client from './client'

export const login = (email, password) =>
  client.post('/auth/login', { email, password })

export const register = (email, password) =>
  client.post('/auth/register', { email, password })

export const getRole = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1])).role
  } catch {
    return null
  }
}

export const logout = () => localStorage.removeItem('token')