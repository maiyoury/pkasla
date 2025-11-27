'use client'

import React, { useState, useEffect } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Template, TemplateFormData } from '@/types/template'

interface TemplateFormProps {
  template?: Template
  onSubmit: (data: TemplateFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

const CATEGORIES = ['Wedding', 'Business', 'Personal', 'Event', 'Other']

export function TemplateForm({
  template,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TemplateFormProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    title: '',
    category: '',
    price: '',
    isPremium: false,
    previewImage: null,
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        title: template.title,
        category: template.category || '',
        price: template.price || '',
        isPremium: template.isPremium,
        previewImage: null,
      })
      if (template.previewImage) {
        setPreview(template.previewImage)
      }
    }
  }, [template])

  const handleInputChange = (field: keyof TemplateFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, previewImage: 'Please select an image file' }))
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, previewImage: 'Image size must be less than 5MB' }))
        return
      }
      setFormData((prev) => ({ ...prev, previewImage: file }))
      setErrors((prev) => ({ ...prev, previewImage: '' }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, previewImage: null }))
    setPreview(template?.previewImage || null)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (formData.price !== '' && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = 'Price must be a valid positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-sm font-semibold text-black mb-2 block">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="e.g., wedding-template-01"
          className="h-10 text-sm"
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-sm font-semibold text-black mb-2 block">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g., Elegant Wedding Invitation"
          className="h-10 text-sm"
          disabled={isSubmitting}
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" className="text-sm font-semibold text-black mb-2 block">
          Category
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleInputChange('category', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="h-10 text-sm">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price" className="text-sm font-semibold text-black mb-2 block">
          Price
        </Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="0.00"
          className="h-10 text-sm"
          disabled={isSubmitting}
        />
        {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
      </div>

      {/* Is Premium */}
      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <Checkbox
          id="isPremium"
          checked={formData.isPremium}
          onCheckedChange={(checked) => handleInputChange('isPremium', checked as boolean)}
          disabled={isSubmitting}
        />
        <Label
          htmlFor="isPremium"
          className="text-sm font-medium text-black cursor-pointer"
        >
          Premium Template
        </Label>
      </div>

      {/* Preview Image */}
      <div>
        <Label className="text-sm font-semibold text-black mb-2 block">
          Preview Image
        </Label>
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full object-cover rounded-lg border border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeImage}
              className="absolute top-2 right-2 h-8 w-8 p-0"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <Label
              htmlFor="previewImage"
              className="cursor-pointer text-sm text-gray-600 hover:text-gray-900"
            >
              Click to upload or drag and drop
            </Label>
            <Input
              id="previewImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
        {errors.previewImage && (
          <p className="text-xs text-red-600 mt-1">{errors.previewImage}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="h-10">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {template ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            template ? 'Update Template' : 'Create Template'
          )}
        </Button>
      </div>
    </form>
  )
}

