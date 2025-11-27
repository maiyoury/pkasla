import { z } from 'zod';

const invitationStatusEnum = z.enum(['pending', 'approved', 'declined']);

/**
 * Create invitation request validation schema
 */
export const createInvitationSchema = z.object({
  body: z.object({
    eventId: z.string().min(1, { message: 'Event ID is required' }),
    message: z
      .string()
      .max(1000, { message: 'Message must not exceed 1000 characters' })
      .trim()
      .optional(),
  }),
});

/**
 * Update invitation status validation schema
 */
export const updateInvitationStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: 'Invitation ID is required' }),
  }),
  body: z.object({
    status: invitationStatusEnum,
  }),
});

/**
 * Get invitation by ID validation schema
 */
export const getInvitationSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: 'Invitation ID is required' }),
  }),
});

/**
 * Delete invitation validation schema
 */
export const deleteInvitationSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: 'Invitation ID is required' }),
  }),
});

/**
 * List invitations query validation schema
 */
export const listInvitationsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce.number().min(1).max(100).default(10).optional(),
    eventId: z.string().optional(),
    userId: z.string().optional(),
    status: invitationStatusEnum.optional(),
  }),
});

/**
 * Type inference for create invitation input
 */
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>['body'];

/**
 * Type inference for update invitation status input
 */
export type UpdateInvitationStatusInput = z.infer<typeof updateInvitationStatusSchema>['body'];

/**
 * Type inference for list invitations query
 */
export type ListInvitationsQuery = z.infer<typeof listInvitationsQuerySchema>['query'];

