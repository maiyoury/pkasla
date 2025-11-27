'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TemplateForm } from '@/components/admin/t/TemplateForm'
import { TemplateFormData } from '@/types/template'
import { useCreateTemplate } from '@/hooks/api/useTemplate'

export default function NewTemplatePage() {
  const router = useRouter()
  const createTemplate = useCreateTemplate()

  const handleSubmit = async (data: TemplateFormData) => {
    try {
      await createTemplate.mutateAsync({
        data: {
          name: data.name,
          title: data.title,
          category: data.category || undefined,
          price: data.price !== '' ? Number(data.price) : undefined,
          isPremium: data.isPremium,
          previewImage: undefined, // Will be handled by file upload
        },
        previewImage: data.previewImage || undefined,
      })
      router.push('/admin/t')
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error creating template:', error)
    }
  }

  const handleCancel = () => {
    router.push('/admin/t')
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-black">Create New Template</h1>
        <p className="text-xs text-gray-600 mt-1">
          Add a new template to the system
        </p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-black">Template Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createTemplate.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}

