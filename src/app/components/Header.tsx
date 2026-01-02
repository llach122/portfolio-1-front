'use client'

import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function Header() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading || !user) return null

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-25"></div>
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name}
              className="relative w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-800">{user.user_metadata.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
