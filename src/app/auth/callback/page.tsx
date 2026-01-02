'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleSession = async (): Promise<void> => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error.message)
        return
      }

      const session: Session | null = data.session

      if (session) {
        router.push('/dashboard')
      }
    }

    handleSession()
  }, [router])

  return <p>Autenticando...</p>
}
