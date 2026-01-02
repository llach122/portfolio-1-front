import { supabase } from '@/lib/supabaseClient'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  const text = await res.text()
  let data: any = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  // 🔥 LOG CLAVE: SIEMPRE
  console.log('🌐 API RESPONSE', {
    endpoint,
    status: res.status,
    ok: res.ok,
    data,
  })

  if (!res.ok) {
    throw data
  }

  return data as T
}
