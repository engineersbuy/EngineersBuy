import apiClient from '@/api/apiClient'
import API_ROUTES from '@/constants/apiRoutes'
import type { ApiResponse, PaginatedResponse, ValuableCustomer, ValuableCustomerFormData } from '@/types'

const valuableCustomerApi = {
  /** Active valuable customers for storefront (public). */
  getActive: () => apiClient.get<ApiResponse<ValuableCustomer[]>>(API_ROUTES.VALUABLE_CUSTOMERS.BASE),

  // ── Admin ──
  getAll: (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }) =>
    apiClient.get<PaginatedResponse<ValuableCustomer>>(API_ROUTES.VALUABLE_CUSTOMERS.ADMIN, { params }),

  create: (data: ValuableCustomerFormData) =>
    apiClient.post<ApiResponse<ValuableCustomer>>(API_ROUTES.VALUABLE_CUSTOMERS.ADMIN, data),

  update: (id: string, data: Partial<ValuableCustomerFormData>) =>
    apiClient.patch<ApiResponse<ValuableCustomer>>(API_ROUTES.VALUABLE_CUSTOMERS.ADMIN_BY_ID(id), data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(API_ROUTES.VALUABLE_CUSTOMERS.ADMIN_BY_ID(id)),
}

export default valuableCustomerApi
