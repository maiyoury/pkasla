import httpStatus from 'http-status';
import { AppError } from '@/common/errors/app-error';
import { templateRepository } from './template.repository';
import type { TemplateDocument } from './template.model';

export interface CreateTemplateInput {
  name: string;
  title: string;
  category?: string;
  price?: number;
  isPremium?: boolean;
  previewImage?: string;
  status?: 'draft' | 'published' | 'archived';
  slug?: string;
  variables?: string[];
}

export interface UpdateTemplateInput {
  name?: string;
  title?: string;
  category?: string;
  price?: number;
  isPremium?: boolean;
  previewImage?: string;
  status?: 'draft' | 'published' | 'archived';
  slug?: string;
  variables?: string[];
}

export interface TemplateResponse {
  id: string;
  name: string;
  title: string;
  category?: string;
  price?: number;
  isPremium: boolean;
  previewImage?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateListFilters {
  category?: string;
  isPremium?: boolean;
  search?: string;
}

type TemplateSource = TemplateDocument | (Record<string, any> & { _id?: unknown }) | null;

/**
 * Sanitize template document to response format
 */
export const sanitizeTemplate = (template: TemplateSource): TemplateResponse | null => {
  if (!template) {
    return null;
  }
  const templateObj =
    typeof (template as TemplateDocument).toObject === 'function'
      ? (template as TemplateDocument).toObject()
      : template;
  const { _id, __v, ...rest } = templateObj as Record<string, any>;
  return {
    ...(rest as Omit<TemplateResponse, 'id'>),
    id: (_id ?? (rest as Record<string, any>).id).toString(),
  } as TemplateResponse;
};

class TemplateService {
  /**
   * Create a new template
   */
  async create(payload: CreateTemplateInput): Promise<TemplateResponse> {
    // Check if template name already exists
    const existing = await templateRepository.findByName(payload.name);
    if (existing) {
      throw new AppError('Template name already exists', httpStatus.CONFLICT);
    }

    const template = await templateRepository.create(payload);
    const safeTemplate = sanitizeTemplate(template);
    if (!safeTemplate) {
      throw new AppError('Unable to create template', httpStatus.INTERNAL_SERVER_ERROR);
    }
    return safeTemplate;
  }

  /**
   * Find template by ID
   */
  async findById(id: string): Promise<TemplateResponse | null> {
    const template = await templateRepository.findById(id);
    return sanitizeTemplate(template as unknown as TemplateDocument);
  }

  /**
   * Find template by ID or throw error if not found
   * @param id - Template ID
   * @param isAdmin - Whether the user is an admin (admins can see all templates, regular users only see published)
   */
  async findByIdOrFail(id: string, isAdmin: boolean = false): Promise<TemplateResponse> {
    const template = await this.findById(id);
    if (!template) {
      throw new AppError('Template not found', httpStatus.NOT_FOUND);
    }
    
    // Regular users can only see published templates
    if (!isAdmin && template.status !== 'published') {
      throw new AppError('Template not found', httpStatus.NOT_FOUND);
    }
    
    return template;
  }

  /**
   * Find template by name
   */
  async findByName(name: string): Promise<TemplateResponse | null> {
    const template = await templateRepository.findByName(name);
    return sanitizeTemplate(template as unknown as TemplateDocument);
  }

  /**
   * Update template by ID
   */
  async updateById(id: string, payload: UpdateTemplateInput): Promise<TemplateResponse> {
    // Check if template exists
    const existing = await templateRepository.findById(id);
    if (!existing) {
      throw new AppError('Template not found', httpStatus.NOT_FOUND);
    }

    // If name is being updated, check if new name already exists
    if (payload.name && payload.name !== existing.name) {
      const nameExists = await templateRepository.findByName(payload.name);
      if (nameExists) {
        throw new AppError('Template name already exists', httpStatus.CONFLICT);
      }
    }

    // Validate price if provided
    if (payload.price !== undefined && payload.price < 0) {
      throw new AppError('Price must be a positive number', httpStatus.BAD_REQUEST);
    }

    const updated = await templateRepository.updateById(id, { $set: payload });
    if (!updated) {
      throw new AppError('Template not found', httpStatus.NOT_FOUND);
    }

    const safeTemplate = sanitizeTemplate(updated as unknown as TemplateDocument);
    if (!safeTemplate) {
      throw new AppError('Unable to update template', httpStatus.INTERNAL_SERVER_ERROR);
    }
    return safeTemplate;
  }

  /**
   * Delete template by ID
   */
  async deleteById(id: string): Promise<void> {
    const template = await templateRepository.findById(id);
    if (!template) {
      throw new AppError('Template not found', httpStatus.NOT_FOUND);
    }

    await templateRepository.deleteById(id);
  }

  /**
   * List templates with pagination and filters
   * @param page - Page number
   * @param pageSize - Items per page
   * @param filters - Filter options
   * @param isAdmin - Whether the user is an admin (admins see all templates, regular users only see published)
   */
  async list(
    page: number = 1,
    pageSize: number = 10,
    filters?: TemplateListFilters,
    isAdmin: boolean = false
  ): Promise<{
    items: TemplateResponse[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const query: Record<string, any> = {};

    // Apply filters
    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.isPremium !== undefined) {
      query.isPremium = filters.isPremium;
    }

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { title: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Regular users can only see published templates
    if (!isAdmin) {
      query.status = 'published';
    }

    const [templates, total] = await Promise.all([
      templateRepository.listPaginated(query, page, pageSize, { createdAt: -1 }),
      templateRepository.countDocuments(query),
    ]);

    const sanitizedTemplates = templates
      .map((template) => sanitizeTemplate(template as unknown as TemplateDocument))
      .filter(Boolean) as TemplateResponse[];

    return {
      items: sanitizedTemplates,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Get all unique categories (event types)
   */
  async getCategories(): Promise<string[]> {
    // Return event types formatted for templates
    // Map event types to template-friendly category names
    return [
      'Wedding',
      'Engagement',
      'Hand-cutting',
      'Birthday',
      'Anniversary',
      'Other'
    ];
  }
}

export const templateService = new TemplateService();

