import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email: string
}

type AuthStore = {
  token: string | null
  user: User | null
  isAuthenticated: boolean

  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)