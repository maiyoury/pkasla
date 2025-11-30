'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TemplateTable } from '@/components/admin/t/TemplateTable'
import { TemplateToolbar } from '@/components/admin/t/TemplateToolbar'
import { TemplateDialog } from '@/components/admin/t/TemplateDialog'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTemplates, useDeleteTemplate, useTemplateCategories } from '@/hooks/api/useTemplate'

const ITEMS_PER_PAGE = 10

export default function AdminTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null)

  // Build filters for API
  const filters = useMemo(() => {
    const apiFilters: {
      page: number
      pageSize: number
      category?: string
      search?: string
    } = {
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
    }

    if (categoryFilter !== 'all') {
      apiFilters.category = categoryFilter
    }

    if (searchTerm) {
      apiFilters.search = searchTerm
    }

    return apiFilters
  }, [currentPage, categoryFilter, searchTerm])

  // Fetch templates from API
  const { data: templatesData, isLoading } = useTemplates(filters)
  const { data: categories = [] } = useTemplateCategories()
  const deleteTemplate = useDeleteTemplate()

  const templates = templatesData?.items || []
  const totalItems = templatesData?.total || 0
  const totalPages = templatesData ? Math.ceil(templatesData.total / templatesData.pageSize) : 0
  const startIndex = templatesData ? (templatesData.page - 1) * templatesData.pageSize : 0

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (currentPage !== 1) setCurrentPage(1)
  }

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value)
    if (currentPage !== 1) setCurrentPage(1)
  }

  const handleDelete = (id: string) => {
    setTemplateToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingTemplateId(null)
    setTemplateDialogOpen(true)
  }

  const handleEdit = (id: string) => {
    setEditingTemplateId(id)
    setTemplateDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setTemplateDialogOpen(open)
    if (!open) {
      setEditingTemplateId(null)
    }
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return

    try {
      await deleteTemplate.mutateAsync(templateToDelete)
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error deleting template:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
        <span className="ml-2 text-xs text-gray-600">Loading templates...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-black">Template Management</h1>
        <p className="text-xs text-gray-600 mt-1">
          Manage and organize all available templates
        </p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
          
            <TemplateToolbar
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              categories={categories}
              onSearchChange={handleSearchChange}
              onCategoryFilterChange={handleCategoryFilterChange}
              onCreate={handleCreate}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {templates.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-xs text-gray-500 mb-4">No templates found</p>
            </div>
          ) : (
            <TemplateTable
              templates={templates}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={ITEMS_PER_PAGE}
              startIndex={startIndex}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isDeleting={deleteTemplate.isPending}
            />
          )}
        </CardContent>
      </Card>

      <TemplateDialog
        open={templateDialogOpen}
        onOpenChange={handleDialogClose}
        templateId={editingTemplateId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTemplate.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteTemplate.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteTemplate.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

