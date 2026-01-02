// src/Services/auth.service.ts
import { apiFetch } from './api'

export type BackendUser = {
  id: string
  email: string
  role: 'admin' | 'driver' | null
  status: 'active' | 'inactive'
  full_name: string
  avatar_url?: string
}

export const authService = {
  async me(): Promise<{ user: BackendUser }> {
    const data = await apiFetch<{ user: BackendUser }>(
      '/api/v1/users/me',
      { method: 'GET' }
    )

    console.log('🧠 RESPUESTA /users/me:', data)
    return data
  },

  async register(payload: {
    role: 'admin' | 'driver'
    fleet_code?: string
  }): Promise<{ user: BackendUser }> {
    const data = await apiFetch<{ user: BackendUser }>(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    )

    console.log('🧠 RESPUESTA /register:', data)
    return data
  },
}
