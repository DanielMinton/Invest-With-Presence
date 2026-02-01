'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { documentsApi, documentCategoriesApi, type Document, type DocumentCategory } from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import {
  FileText,
  Search,
  Upload,
  Filter,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  File,
  Image,
  FileSpreadsheet,
  X,
  Check,
} from 'lucide-react'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [searchQuery, selectedCategory])

  const loadData = async () => {
    try {
      setLoading(true)
      const [docsResponse, catsResponse] = await Promise.all([
        documentsApi.list({
          ...(searchQuery && { search: searchQuery }),
          ...(selectedCategory && { category: selectedCategory }),
        }),
        documentCategoriesApi.list(),
      ])
      setDocuments(docsResponse.results)
      setCategories(catsResponse)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="w-5 h-5" />
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-5 h-5" />
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const handleDownload = async (doc: Document) => {
    try {
      const result = await documentsApi.download(doc.id)
      window.open(result.download_url, '_blank')
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-900 dark:text-white">
            Documents
          </h1>
          <p className="text-brand-500 dark:text-brand-400 mt-1">
            Secure document vault for client files
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700
                       bg-white dark:bg-brand-800 text-brand-900 dark:text-white
                       focus:ring-2 focus:ring-accent-500 focus:border-transparent
                       transition-all duration-200 outline-none text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setSelectedCategory('')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
                !selectedCategory
                  ? 'bg-accent-500 text-white'
                  : 'bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-700'
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
                  selectedCategory === cat.id
                    ? 'bg-accent-500 text-white'
                    : 'bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-700'
                )}
              >
                {cat.name} ({cat.document_count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-brand-500">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="card p-8 text-center">
          <FolderOpen className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-brand-900 dark:text-white mb-2">
            No documents found
          </h3>
          <p className="text-brand-500 mb-4">
            {searchQuery ? 'Try adjusting your search criteria' : 'Upload your first document to get started'}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
          >
            <Upload size={16} />
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-300">
                  {getFileIcon(doc.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-brand-900 dark:text-white truncate">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-brand-500 dark:text-brand-400 truncate">
                    {doc.file_name}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-brand-500 dark:text-brand-400">
                <span>{doc.file_size_display}</span>
                <span>{formatDate(doc.created_at)}</span>
              </div>

              {doc.category_name && (
                <div className="mt-3">
                  <span className="px-2 py-0.5 text-xs bg-brand-100 dark:bg-brand-700 text-brand-600 dark:text-brand-300 rounded-full">
                    {doc.category_name}
                  </span>
                </div>
              )}

              {doc.household_name && (
                <div className="mt-2 text-xs text-brand-500 dark:text-brand-400">
                  {doc.household_name}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-1 btn btn-secondary px-3 py-1.5 rounded-lg text-xs inline-flex items-center justify-center gap-1"
                >
                  <Download size={14} />
                  Download
                </button>
                <button className="p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors">
                  <Eye className="w-4 h-4 text-brand-500" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors">
                  <Trash2 className="w-4 h-4 text-danger-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-brand-900 rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800"
            >
              <X className="w-5 h-5 text-brand-500" />
            </button>

            <h2 className="text-xl font-semibold text-brand-900 dark:text-white mb-4">
              Upload Document
            </h2>

            <div
              className="border-2 border-dashed border-brand-200 dark:border-brand-700 rounded-xl p-8 text-center cursor-pointer hover:border-accent-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-brand-400 mx-auto mb-3" />
              <p className="text-brand-600 dark:text-brand-300 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-brand-500">
                PDF, DOC, XLS, PNG, JPG (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="btn btn-primary px-4 py-2 rounded-lg text-sm">
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
