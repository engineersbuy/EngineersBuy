import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router'
import toast from 'react-hot-toast'
import authApi from '@/services/authApi'
import { useAuthStore } from '@/store'
import { getAccessToken } from '@/api/apiClient'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types'

// ─── Error Helper ───────────────────────────────────────────────────────────────

function getErrorMessage(error: AxiosError<ApiResponse>): string {
  return error.response?.data?.message || error.message || 'Something went wrong'
}

// ─── Auth Bootstrap ─────────────────────────────────────────────────────────────
// Runs once on app mount: hydrates the user from the server (validating any
// persisted session) and flips isLoading/isInitialized so guards can resolve.

export function useInitAuth() {
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const setLoading = useAuthStore((s) => s.setLoading)
  const setInitialized = useAuthStore((s) => s.setInitialized)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const checkInactivity = useAuthStore((s) => s.checkInactivity)
  const recordActivity = useAuthStore((s) => s.recordActivity)

  useEffect(() => {
    let active = true

    // Check if the user (non-admin) has been inactive for more than a week
    if (checkInactivity()) {
      setLoading(false)
      setInitialized(true)
      return
    }

    async function bootstrap() {
      // No persisted session and no token → nothing to restore.
      if (!isAuthenticated && !getAccessToken()) {
        setLoading(false)
        setInitialized(true)
        return
      }

      try {
        const res = await authApi.getMe()
        if (active) {
          setUser(res.data.data)
          recordActivity()
          setLoading(false)
          setInitialized(true)
        }
      } catch {
        if (active) {
          logout()
        }
      }
    }

    void bootstrap()

    // Activity tracking: Listen for user interaction events to record activity
    const handleActivity = () => {
      recordActivity()
    }

    window.addEventListener('pointerdown', handleActivity, { passive: true })
    window.addEventListener('keydown', handleActivity, { passive: true })
    window.addEventListener('scroll', handleActivity, { passive: true })
    window.addEventListener('touchstart', handleActivity, { passive: true })

    // Periodic check every 5 minutes (for tabs left open with no interaction for > 1 week)
    const interval = setInterval(() => {
      checkInactivity()
    }, 5 * 60 * 1000)

    return () => {
      active = false
      window.removeEventListener('pointerdown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// ─── Login Mutation ─────────────────────────────────────────────────────────────

export function useLogin(options?: { onSuccess?: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data.data
      login(user, accessToken, refreshToken)
      toast.success(`Welcome back, ${user.firstName}!`)

      if (options?.onSuccess) {
        // Modal context: call the callback, skip navigation
        options.onSuccess()
      } else {
        // Page context: existing redirect logic (unchanged)
        const params = new URLSearchParams(location.search)
        const redirect = params.get('redirect')
        const fromState = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
        const destination =
          redirect ||
          fromState ||
          (user.role === 'admin'
            ? '/admin'
            : user.role === 'vendor'
              ? '/vendor'
              : '/')
        navigate(destination, { replace: true })
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// ─── Register Mutation ──────────────────────────────────────────────────────────
// Registration does NOT issue a session; the user must sign in afterwards.

export function useRegister(options?: { onSuccess?: () => void }) {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Account created! Please sign in to continue.')

      if (options?.onSuccess) {
        // Modal context: call the callback (switch to login view)
        options.onSuccess()
      } else {
        // Page context: existing navigate to /login (unchanged)
        navigate('/login', { replace: true })
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// ─── Logout Mutation ────────────────────────────────────────────────────────────

export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      toast.success('Signed out successfully')
      navigate('/login', { replace: true })
    },
    onError: () => {
      logout()
      navigate('/login', { replace: true })
    },
  })
}

// ─── Forgot Password Mutation ───────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('If that email exists, a reset link is on its way.')
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// ─── Reset Password Mutation ────────────────────────────────────────────────────

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: { password: string; confirmPassword: string } }) =>
      authApi.resetPassword(token, data),
    onSuccess: () => {
      toast.success('Password reset successful! Please sign in.')
      navigate('/login', { replace: true })
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// ─── Change Password Mutation ───────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password updated successfully')
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast.error(getErrorMessage(error))
    },
  })
}
