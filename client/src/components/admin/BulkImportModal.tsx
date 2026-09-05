import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  X,
  Plus,
  Edit3,
  Loader2,
  Database,
  ArrowRight,
  Download,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { productApi } from '@/services'
import type { BulkImportPreviewResult, BulkPreviewItem } from '@/types'

interface BulkImportModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'all' | 'create' | 'update' | 'error'

export function BulkImportModal({ isOpen, onClose }: BulkImportModalProps) {
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewResult, setPreviewResult] = useState<BulkImportPreviewResult | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('all')

  // Preview Mutation
  const previewMutation = useMutation({
    mutationFn: (file: File) => productApi.previewBulkImport(file).then((res) => res.data.data),
    onSuccess: (data) => {
      setPreviewResult(data)
      toast.success(`Preview generated: ${data.validCount} valid items, ${data.errorCount} errors`)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to generate import preview.')
    },
  })

  // Execute Mutation (with batch chunking to prevent 413 payload limit errors)
  const executeMutation = useMutation({
    mutationFn: async (validItems: BulkPreviewItem[]) => {
      const BATCH_SIZE = 50
      let createdCount = 0
      let updatedCount = 0
      let totalExecuted = 0

      for (let i = 0; i < validItems.length; i += BATCH_SIZE) {
        const chunk = validItems.slice(i, i + BATCH_SIZE)
        const res = await productApi.executeBulkImport(chunk)
        const data = res.data.data
        createdCount += data.createdCount
        updatedCount += data.updatedCount
        totalExecuted += data.totalExecuted
      }

      return { createdCount, updatedCount, totalExecuted }
    },
    onSuccess: (data) => {
      toast.success(
        `Bulk Import Successful! Created ${data.createdCount} products, updated ${data.updatedCount} products.`
      )
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      handleClose()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to execute bulk import.')
    },
  })

  if (!isOpen) return null

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewResult(null)
    setActiveTab('all')
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      previewMutation.mutate(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      previewMutation.mutate(file)
    }
  }

  const downloadSampleTemplate = () => {
    const headers = ['sku', 'name', 'category', 'brand', 'price', 'salePrice', 'stock', 'description', 'specifications']
    const sampleRows = [
      'SW-OSC-001,Digital Storage Oscilloscope 100MHz,Laboratory Instruments,Scientific Wala,24999,22999,15,"100MHz 2-channel digital storage oscilloscope with 1GSa/s sampling rate","Bandwidth: 100MHz | Channels: 2 | Sample Rate: 1GSa/s"',
      'SW-MIC-002,Binocular Laboratory Microscope 1000x,Microscopes & Optics,Scientific Wala,14999,13499,20,"High precision optical microscope with LED illumination","Magnification: 1000x | Objectives: 4x 10x 40x 100x | Illumination: LED"',
      'SW-SEN-003,Precision Digital pH Sensor Pro,Sensors & Transducers,Scientific Wala,3499,,50,"Electrochemical pH probe with BNC connector for scientific lab testing","Range: 0-14 pH | Accuracy: +/-0.01 pH | Output: BNC"',
    ]
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...sampleRows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'scientific_wala_product_import_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const validItemsToImport = previewResult?.items.filter((i) => i.action !== 'error') || []

  const filteredItems =
    previewResult?.items.filter((item) => {
      if (activeTab === 'create') return item.action === 'create'
      if (activeTab === 'update') return item.action === 'update'
      if (activeTab === 'error') return item.action === 'error'
      return true
    }) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">Bulk Product Import</h2>
              <p className="text-xs text-muted-foreground">
                Upload Excel (.xlsx, .xls) or CSV files to add or update catalog items in bulk
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSampleTemplate}
              leftIcon={<Download className="h-3.5 w-3.5" />}
              className="text-xs hidden sm:inline-flex"
            >
              Sample Template
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {!previewResult ? (
            /* Step 1: Upload File */
            <div className="space-y-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-10 text-center transition-all hover:border-blue-500/50 hover:bg-blue-500/5"
              >
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  disabled={previewMutation.isPending}
                />
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shadow-inner">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Upload Spreadsheet File</h3>
                <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
                  Drag and drop your Excel (<span className="font-semibold text-foreground">.xlsx</span>,{' '}
                  <span className="font-semibold text-foreground">.xls</span>) or{' '}
                  <span className="font-semibold text-foreground">.csv</span> file here, or click to browse.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="gradient"
                    size="sm"
                    loading={previewMutation.isPending}
                    leftIcon={<FileSpreadsheet className="h-4 w-4" />}
                  >
                    Select Spreadsheet
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadSampleTemplate()
                    }}
                    leftIcon={<Download className="h-3.5 w-3.5" />}
                  >
                    Download Template
                  </Button>
                </div>
              </div>

              {previewMutation.isPending && (
                <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-600 dark:text-blue-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">
                    Parsing {selectedFile?.name ? `"${selectedFile.name}"` : 'spreadsheet'} & validating records...
                  </span>
                </div>
              )}

              {/* Supported Columns Guide */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Recognized Spreadsheet Columns:</span>
                </div>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Required:</strong> <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">sku</code>,{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">name</code>,{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">category</code>,{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">price</code>,{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">stock</code>
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Optional:</strong> <code className="bg-muted px-1.5 py-0.5 rounded font-mono">brand</code>,{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded font-mono">salePrice</code>,{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded font-mono">description</code>,{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded font-mono">specifications</code> (format: Key: Value | Key2: Value2)
                </p>
              </div>
            </div>
          ) : (
            /* Step 2: Dry-Run Preview Summary & Tabbed View */
            <div className="space-y-6">
              {/* Stat Summary Header */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground font-medium">Total Rows</p>
                  <p className="text-xl font-bold text-foreground">{previewResult.totalRows}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Valid Items</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{previewResult.validCount}</p>
                </div>
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">New Products</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{previewResult.newProductsCount}</p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Updates</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{previewResult.updatedProductsCount}</p>
                </div>
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">Errors</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">{previewResult.errorCount}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeTab === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('all')}
                  >
                    All ({previewResult.totalRows})
                  </Button>
                  <Button
                    variant={activeTab === 'create' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('create')}
                    className="gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5 text-blue-500" />
                    New ({previewResult.newProductsCount})
                  </Button>
                  <Button
                    variant={activeTab === 'update' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('update')}
                    className="gap-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                    Updates ({previewResult.updatedProductsCount})
                  </Button>
                  <Button
                    variant={activeTab === 'error' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('error')}
                    className="gap-1.5"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    Errors ({previewResult.errorCount})
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewResult(null)
                    setSelectedFile(null)
                  }}
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  Upload Another File
                </Button>
              </div>

              {/* Preview Table */}
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="max-h-[350px] overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-muted/80 backdrop-blur-md uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-3 py-2.5 font-semibold">Row</th>
                        <th className="px-3 py-2.5 font-semibold">Action</th>
                        <th className="px-3 py-2.5 font-semibold">SKU</th>
                        <th className="px-3 py-2.5 font-semibold">Product Name</th>
                        <th className="px-3 py-2.5 font-semibold">Category</th>
                        <th className="px-3 py-2.5 font-semibold">Brand</th>
                        <th className="px-3 py-2.5 font-semibold">Price</th>
                        <th className="px-3 py-2.5 font-semibold">Stock</th>
                        <th className="px-3 py-2.5 font-semibold">Details / Errors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-muted-foreground">
                            No items match the selected tab filter.
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map((item) => (
                          <tr
                            key={`${item.rowNumber}-${item.sku}`}
                            className={
                              item.action === 'error'
                                ? 'bg-red-500/5 hover:bg-red-500/10'
                                : 'hover:bg-muted/30'
                            }
                          >
                            <td className="px-3 py-2.5 font-mono text-muted-foreground">#{item.rowNumber}</td>
                            <td className="px-3 py-2.5">
                              {item.action === 'create' && (
                                <Badge variant="info" size="sm">
                                  + Create
                                </Badge>
                              )}
                              {item.action === 'update' && (
                                <Badge variant="warning" size="sm">
                                  Update
                                </Badge>
                              )}
                              {item.action === 'error' && (
                                <Badge variant="destructive" size="sm">
                                  Error
                                </Badge>
                              )}
                            </td>
                            <td className="px-3 py-2.5 font-mono font-medium text-foreground">{item.sku}</td>
                            <td className="px-3 py-2.5 font-medium text-foreground max-w-[180px] truncate">
                              {item.name}
                            </td>
                            <td className="px-3 py-2.5 text-muted-foreground">{item.categoryName || '—'}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{item.brandName || '—'}</td>
                            <td className="px-3 py-2.5 font-medium text-foreground">₹{item.price}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{item.stock}</td>
                            <td className="px-3 py-2.5">
                              {item.action === 'error' ? (
                                <ul className="list-disc list-inside text-red-600 dark:text-red-400 space-y-0.5">
                                  {item.errors?.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                  ))}
                                </ul>
                              ) : item.changes && item.changes.length > 0 ? (
                                <div className="space-y-0.5 text-muted-foreground text-[11px]">
                                  {item.changes.map((change, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      <span>{change}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready for import</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          {previewResult && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{validItemsToImport.length}</span> of{' '}
                {previewResult.totalRows} rows ready to import
              </span>

              <Button
                variant="gradient"
                loading={executeMutation.isPending}
                disabled={validItemsToImport.length === 0}
                onClick={() => executeMutation.mutate(validItemsToImport)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Confirm & Import {validItemsToImport.length} Items
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
