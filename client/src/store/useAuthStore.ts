import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { clearTokens, setAccessToken } from '@/api/apiClient'

// ─── Constants ──────────────────────────────────────────────────────────────────
// 7 days in milliseconds (1 week inactivity window for regular users)
export const INACTIVITY_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000

// ─── Auth Store ─────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  lastActivityAt: number

  // Actions
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  login: (user: User, accessToken: string, refreshToken?: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  recordActivity: () => void
  checkInactivity: () => boolean
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
      lastActivityAt: Date.now(),

      setUser: (user) => {
        set({ user, isAuthenticated: true, lastActivityAt: Date.now() })
      },

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      login: (user, accessToken, refreshToken) => {
        setAccessToken(accessToken, refreshToken)
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          lastActivityAt: Date.now(),
        })
      },

      logout: () => {
        clearTokens()
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          lastActivityAt: Date.now(),
        })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      recordActivity: () => {
        const state = get()
        if (!state.isAuthenticated) return
        const now = Date.now()
        // Throttle updates to at most once every 30 seconds to prevent unnecessary writes
        if (now - (state.lastActivityAt || 0) > 30_000) {
          set({ lastActivityAt: now })
        }
      },

      checkInactivity: () => {
        const state = get()
        if (!state.isAuthenticated || !state.user) return false

        // Admin accounts NEVER get logged out due to inactivity — only manual logout
        if (state.user.role === 'admin') {
          return false
        }

        // Regular users get logged out if inactive for more than 1 week (7 days)
        const now = Date.now()
        const lastActive = state.lastActivityAt || now
        if (now - lastActive > INACTIVITY_TIMEOUT_MS) {
          get().logout()
          return true
        }

        return false
      },
    }),
    {
      name: 'scientificwala-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastActivityAt: state.lastActivityAt,
      }),
    }
  )
)

export default useAuthStore
