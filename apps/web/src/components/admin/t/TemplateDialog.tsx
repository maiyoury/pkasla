'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TemplateForm } from '@/components/admin/t/TemplateForm'
import { TemplateFormData } from '@/types/template'
import { useCreateTemplate, useUpdateTemplate, useTemplate } from '@/hooks/api/useTemplate'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateId?: string | null
}

export function TemplateDialog({ open, onOpenChange, templateId }: TemplateDialogProps) {
  const isEditMode = !!templateId && open
  const { data: template, isLoading } = useTemplate(isEditMode ? templateId! : '')
  const createTemplate = useCreateTemplate()
  const updateTemplate = useUpdateTemplate()

  const handleSubmit = async (data: TemplateFormData) => {
    try {
      // Determine if we have a new file to upload
      const previewImageFile = data.previewImage instanceof File ? data.previewImage : undefined
      const previewImageUrl = typeof data.previewImage === 'string' ? data.previewImage : undefined

      // Prepare base data object
      const baseData = {
        name: data.name,
        title: data.title,
        category: data.category || undefined,
        price: data.price !== '' ? Number(data.price) : undefined,
        isPremium: data.isPremium,
        status: data.status || 'draft',
        slug: data.slug || undefined,
        variables: data.variables && data.variables.length > 0 ? data.variables : undefined,
        assets: data.assets && (data.assets.images?.length || data.assets.colors?.length || data.assets.fonts?.length)
          ? data.assets
          : undefined,
      }

      if (isEditMode && templateId) {
        // For update: include previewImage URL in data only if no new file is being uploaded
        await updateTemplate.mutateAsync({
          id: templateId,
          data: {
            ...baseData,
            // Only include previewImage URL if we're not uploading a new file
            ...(previewImageFile ? {} : previewImageUrl ? { previewImage: previewImageUrl } : {}),
          },
          previewImage: previewImageFile || null,
        })
      } else {
        // For create: include previewImage URL in data only if no new file is being uploaded
        await createTemplate.mutateAsync({
          data: {
            ...baseData,
            // Only include previewImage URL if we're not uploading a new file
            ...(previewImageFile ? {} : previewImageUrl ? { previewImage: previewImageUrl } : {}),
          },
          previewImage: previewImageFile,
        })
      }
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation hook
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} template:`, error)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // Show loading state when editing and template is loading
  if (isEditMode && isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Loading template</DialogTitle>
          <div className="flex items-center justify-center py-12">
            <Spinner />
            <p className="ml-2 text-xs text-gray-600">Loading template...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-semibold text-black">
            {isEditMode ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            {isEditMode ? 'Update template information' : 'Add a new template to the system'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <TemplateForm
            template={template || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isEditMode ? updateTemplate.isPending : createTemplate.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

