import { request } from '@/utils/request'
import type { BodyPartValue } from '@/constants/course'
import type { Course } from '@/types/domain'

export interface CourseListParams {
  keyword?: string
  coachId?: number
  bodyParts?: BodyPartValue[]
}

export const courseApi = {
  list(params?: CourseListParams) {
    return request.get<unknown, Course[]>('/courses', { params })
  },
  recommended() {
    return request.get<unknown, Course[]>('/courses/recommended')
  },
  detail(id: number) {
    return request.get<unknown, Course>(`/courses/${id}`)
  },
  create(payload: Partial<Course>) {
    return request.post<unknown, Course>('/courses', payload)
  }
}
