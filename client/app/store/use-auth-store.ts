import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email: string
  role: string
}

type AuthStore = {
  token: string | null
  user: User | null
  isAuthenticated: boolean

  login: (token: string, user: User) => void
  logout: () => void
}

function setCookie(token: string) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `PLATFORM_ACCESS_TOKEN=${token}; path=/; maxAge=${8 * 60 * 60}; SameSite=Lax${secure}`
}

function clearCookie() {
  document.cookie = 'PLATFORM_ACCESS_TOKEN=; path=/; maxAge=0'
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        setCookie(token)
        return set({
          token,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        clearCookie()
        return set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Restore cookie from persisted store on page load (handles F5 / direct navigation)
const stored = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem('auth-storage') || '{}')
  : {}
if (stored?.state?.token) {
  setCookie(stored.state.token)
}