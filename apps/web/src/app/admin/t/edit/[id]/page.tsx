'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TemplateForm } from '@/components/admin/t/TemplateForm'
import { TemplateFormData } from '@/types/template'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { useTemplate, useUpdateTemplate } from '@/hooks/api/useTemplate'

export default function EditTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { data: template, isLoading } = useTemplate(id)
  const updateTemplate = useUpdateTemplate()

  const handleSubmit = async (data: TemplateFormData) => {
    try {
      await updateTemplate.mutateAsync({
        id,
        data: {
          name: data.name,
          title: data.title,
          category: data.category || undefined,
          price: data.price !== '' ? Number(data.price) : undefined,
          isPremium: data.isPremium,
        },
        previewImage: data.previewImage || null,
      })
      router.push('/admin/t')
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error updating template:', error)
    }
  }

  const handleCancel = () => {
    router.push('/admin/t')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
        <span className="ml-2 text-xs text-gray-600">Loading template...</span>
      </div>
    )
  }

  if (!template) {
    return null
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-black">Edit Template</h1>
        <p className="text-xs text-gray-600 mt-1">
          Update template information
        </p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-black">Template Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm
            template={template}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={updateTemplate.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}

