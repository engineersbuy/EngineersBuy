import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Upload, Building2, ExternalLink, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { valuableCustomerApi, uploadApi } from '@/services'
import { DataTable, AdminPageHeader, StatusIndicator } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/ui/form-field'
import { Loader } from '@/components/ui/loader'
import { ErrorFallback } from '@/components/ui/error'
import { modalOverlayVariants, modalContentVariants } from '@/config/animations'
import type { ValuableCustomer, ValuableCustomerFormData } from '@/types'

interface ApiError {
  response?: { data?: { message?: string } }
}

const emptyForm: ValuableCustomerFormData = {
  name: '',
  logo: { url: '', publicId: '' },
  website: '',
  description: '',
  position: 0,
  isActive: true,
}

export default function ValuableCustomersAdminPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ValuableCustomer | null>(null)
  const [form, setForm] = useState<ValuableCustomerFormData>(emptyForm)
  const [uploading, setUploading] = useState(false)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'valuable-customers'],
    queryFn: async () => (await valuableCustomerApi.getAll({ limit: 100 })).data.data,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'valuable-customers'] })

  const createMutation = useMutation({
    mutationFn: (payload: ValuableCustomerFormData) => valuableCustomerApi.create(payload),
    onSuccess: () => {
      toast.success('Valuable customer added successfully')
      invalidate()
      closeModal()
    },
    onError: (err: ApiError) =>
      toast.error(err.response?.data?.message || 'Failed to add customer'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ValuableCustomerFormData> }) =>
      valuableCustomerApi.update(id, payload),
    onSuccess: () => {
      toast.success('Valuable customer updated')
      invalidate()
      closeModal()
    },
    onError: (err: ApiError) =>
      toast.error(err.response?.data?.message || 'Failed to update customer'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => valuableCustomerApi.remove(id),
    onSuccess: () => {
      toast.success('Customer deleted')
      invalidate()
    },
    onError: (err: ApiError) =>
      toast.error(err.response?.data?.message || 'Failed to delete customer'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (customer: ValuableCustomer) => {
    setEditing(customer)
    setForm({
      name: customer.name,
      logo: customer.logo || { url: '', publicId: '' },
      website: customer.website || '',
      description: customer.description || '',
      position: customer.position ?? 0,
      isActive: customer.isActive,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const res = await uploadApi.image(file)
      setForm((f) => ({
        ...f,
        logo: { url: res.data.data.url, publicId: res.data.data.publicId },
      }))
      toast.success('Logo uploaded successfully')
    } catch (err) {
      toast.error((err as ApiError).response?.data?.message || 'Logo upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleToggleActive = (customer: ValuableCustomer) => {
    updateMutation.mutate({
      id: customer._id,
      payload: { isActive: !customer.isActive },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Customer name is required')
      return
    }
    if (!form.logo?.url) {
      toast.error('Customer logo is required')
      return
    }

    const payload: ValuableCustomerFormData = {
      name: form.name.trim(),
      logo: form.logo,
      website: form.website?.trim() || undefined,
      description: form.description?.trim() || undefined,
      position: Number(form.position) || 0,
      isActive: form.isActive,
    }

    if (editing) {
      updateMutation.mutate({ id: editing._id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleDelete = (customer: ValuableCustomer) => {
    if (confirm(`Are you sure you want to remove "${customer.name}"?`)) {
      deleteMutation.mutate(customer._id)
    }
  }

  const columns = [
    {
      key: 'customer',
      header: 'Customer / Institution',
      render: (row: ValuableCustomer) => (
        <div className="flex items-center gap-3">
          {row.logo?.url ? (
            <img
              src={row.logo.url}
              alt={row.name}
              className="h-10 w-10 rounded-lg object-contain bg-white dark:bg-zinc-800 p-1 border border-border shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate">{row.name}</div>
            {row.description && (
              <div className="text-xs text-muted-foreground truncate max-w-xs">{row.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'website',
      header: 'Website',
      render: (row: ValuableCustomer) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="truncate max-w-[150px]">{row.website.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      key: 'position',
      header: 'Order',
      render: (row: ValuableCustomer) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">
          #{row.position ?? 0}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row: ValuableCustomer) => (
        <button
          type="button"
          onClick={() => handleToggleActive(row)}
          title="Click to toggle status"
          className="cursor-pointer transition-opacity hover:opacity-80"
        >
          <StatusIndicator status={row.isActive ? 'active' : 'inactive'} />
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row: ValuableCustomer) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openEdit(row)}
            aria-label="Edit customer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleDelete(row)}
            aria-label="Delete customer"
            className="text-error-500 hover:text-error-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (isError) return <ErrorFallback error={error as Error} resetErrorBoundary={refetch} />

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div>
      <AdminPageHeader
        title="Valuable Customers"
        description="Manage prestigious partner institutions, universities, and research labs displayed on the storefront banner."
        action={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            Add Customer
          </Button>
        }
      />

      <DataTable
        columns={columns as never}
        data={(data ?? []) as never}
        isLoading={isLoading}
        emptyMessage="No valuable customers added yet. Click 'Add Customer' to create the first one."
      />

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
            <motion.div
              className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto"
              variants={modalContentVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {editing ? 'Edit Valuable Customer' : 'Add Valuable Customer'}
                </h2>
                <Button variant="ghost" size="icon-sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Customer / Institution Name" required>
                  <Input
                    placeholder="e.g. IIT Delhi, AIIMS New Delhi"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </FormField>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Logo Image <span className="text-destructive">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {form.logo?.url ? (
                      <div className="relative h-16 w-16 rounded-lg border border-border p-1 bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <img
                          src={form.logo.url}
                          alt="Logo Preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 shrink-0">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleUpload(file)
                          }}
                          disabled={uploading}
                        />
                        <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                          {uploading ? (
                            <>
                              <Loader className="h-3.5 w-3.5" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5" />
                              Upload Logo File
                            </>
                          )}
                        </span>
                      </label>
                      <Input
                        placeholder="Or enter image URL directly"
                        value={form.logo?.url || ''}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            logo: { ...f.logo, url: e.target.value },
                          }))
                        }
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                <FormField label="Website URL (optional)">
                  <Input
                    type="url"
                    placeholder="https://home.iitd.ac.in"
                    value={form.website || ''}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  />
                </FormField>

                <FormField label="Tagline / Description (optional)">
                  <Textarea
                    placeholder="e.g. Centre of Excellence in Engineering & Science"
                    value={form.description || ''}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    maxLength={250}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField label="Display Position">
                      <Input
                        type="number"
                        min={0}
                        value={form.position ?? 0}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, position: parseInt(e.target.value) || 0 }))
                        }
                      />
                    </FormField>
                    <p className="text-[11px] text-muted-foreground mt-1">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center pt-6">
                    <Checkbox
                      id="customer-active"
                      label="Active on Storefront"
                      checked={form.isActive ?? true}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isActive: e.target.checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving || uploading}>
                    {isSaving ? (
                      <>
                        <Loader className="mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : editing ? (
                      'Save Changes'
                    ) : (
                      'Add Customer'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
