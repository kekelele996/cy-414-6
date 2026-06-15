import { z } from 'zod'

export const BODY_PARTS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'fullbody', 'glutes'] as const
export type BodyPartValue = typeof BODY_PARTS[number]

export const courseCreateSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  duration: z.number().int().min(15).max(240),
  price: z.number().min(0),
  maxCapacity: z.number().int().min(1).max(99),
  schedule: z.array(z.string().datetime({ offset: true })).min(1),
  bodyParts: z.array(z.enum(BODY_PARTS)).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('published')
})

export const courseQuerySchema = z.object({
  keyword: z.string().optional(),
  coachId: z.coerce.number().int().positive().optional(),
  bodyParts: z
    .union([z.array(z.enum(BODY_PARTS)), z.enum(BODY_PARTS)])
    .optional()
    .transform(v => (Array.isArray(v) ? v : v ? [v] : undefined))
})

export const COURSE_MODEL_COUPLED_FIELDS = ['coach_id', 'schedule', 'status', 'price', 'max_capacity', 'body_parts']
