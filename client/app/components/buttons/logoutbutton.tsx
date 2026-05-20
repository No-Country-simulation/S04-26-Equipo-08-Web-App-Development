'use client'

import { useAuthStore } from '@/app/store/use-auth-store'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()

    router.push('/auth/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded"
    >
      Cerrar sesión
    </button>
  )
}