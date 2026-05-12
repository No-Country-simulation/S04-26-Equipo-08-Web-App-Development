'use client'

import { useAuthStore } from '@/app/store/use-auth-store'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()

    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Cerrar sesión
    </button>
  )
}