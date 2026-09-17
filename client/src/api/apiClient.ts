import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import env from '@/config/env'
import API_ROUTES from '@/constants/apiRoutes'
import type { ApiResponse } from '@/types'

// ─── Axios Instance ─────────────────────────────────────────────────────────────
// The backend issues a short-lived access token (returned in the JSON body and
// kept in localStorage) and a long-lived refresh token (httpOnly cookie scoped to
// /api/v1/auth). `withCredentials` ensures that cookie travels with refresh calls.

const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// ─── Access & Refresh Token Storage ──────────────────────────────────────────────

const ACCESS_TOKEN_KEY = 'scientificwala_access_token'
const REFRESH_TOKEN_KEY = 'scientificwala_refresh_token'

const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY)
const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY)

const setAccessToken = (token: string, refreshToken?: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// ─── Refresh Queue ──────────────────────────────────────────────────────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error || !token) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

// ─── Request Interceptor ────────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor (silent refresh) ──────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status
    const url = originalRequest?.url || ''

    // Never attempt a refresh for auth endpoints themselves (e.g. a failed login
    // returns 401 — that should surface as an error, not a refresh loop).
    const isAuthRoute = url.includes('/auth/')

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      // If we have no access token at all, there is nothing to refresh against.
      if (!getAccessToken()) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const storedRefreshToken = getRefreshToken()
        // The refresh token lives in an httpOnly cookie and is also sent in body/header
        // to guarantee cross-domain reliability between scientificwala.com and onrender.com
        const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${env.API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`,
          { refreshToken: storedRefreshToken },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
              ...(storedRefreshToken ? { 'x-refresh-token': storedRefreshToken } : {}),
            },
          }
        )

        const newAccessToken = data.data.accessToken
        const newRefreshToken = data.data.refreshToken
        setAccessToken(newAccessToken, newRefreshToken)
        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        // Avoid redirect loops if we are already on an auth page.
        if (!window.location.pathname.startsWith('/login')) {
          const redirect = encodeURIComponent(window.location.pathname + window.location.search)
          window.location.href = `/login?redirect=${redirect}`
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export { apiClient, getAccessToken, getRefreshToken, setAccessToken, clearTokens }
export default apiClient
