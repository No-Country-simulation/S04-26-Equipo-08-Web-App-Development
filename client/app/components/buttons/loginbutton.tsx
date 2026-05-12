'use client'

import { useAuthStore } from "@/app/store/use-auth-store"


export default function LoginButton() {
  const login = useAuthStore((state) => state.login)

  const handleLogin = async () => {
    login('TOKEN_JWT', {
      id: '1',
      name: 'Orlando',
      email: 'test@test.com',
    })
  }

  return <button onClick={handleLogin}>Login</button>
}