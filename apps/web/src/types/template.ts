export interface Template {
  id: string
  name: string
  title: string
  category?: string
  price?: number
  isPremium: boolean
  previewImage?: string
  createdAt: string
  updatedAt?: string
}

export interface TemplateFormData {
  name: string
  title: string
  category: string
  price: number | ''
  isPremium: boolean
  previewImage: File | null
}

export interface TemplateListResponse {
  items: Template[]
  total: number
  page: number
  pageSize: number
}

