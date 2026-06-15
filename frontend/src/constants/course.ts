export const BodyPart = {
  CHEST: 'chest',
  BACK: 'back',
  LEGS: 'legs',
  SHOULDERS: 'shoulders',
  ARMS: 'arms',
  CORE: 'core',
  CARDIO: 'cardio',
  FULLBODY: 'fullbody',
  GLUTES: 'glutes'
} as const

export type BodyPartValue = (typeof BodyPart)[keyof typeof BodyPart]

export const BodyPartLabel: Record<BodyPartValue, string> = {
  [BodyPart.CHEST]: '胸部',
  [BodyPart.BACK]: '背部',
  [BodyPart.LEGS]: '腿部',
  [BodyPart.SHOULDERS]: '肩部',
  [BodyPart.ARMS]: '手臂',
  [BodyPart.CORE]: '核心',
  [BodyPart.CARDIO]: '有氧',
  [BodyPart.FULLBODY]: '全身',
  [BodyPart.GLUTES]: '臀部'
}

export const BodyPartColor: Record<BodyPartValue, string> = {
  [BodyPart.CHEST]: '#f59e0b',
  [BodyPart.BACK]: '#10b981',
  [BodyPart.LEGS]: '#3b82f6',
  [BodyPart.SHOULDERS]: '#8b5cf6',
  [BodyPart.ARMS]: '#ec4899',
  [BodyPart.CORE]: '#ef4444',
  [BodyPart.CARDIO]: '#14b8a6',
  [BodyPart.FULLBODY]: '#6366f1',
  [BodyPart.GLUTES]: '#f97316'
}

export const ALL_BODY_PARTS: BodyPartValue[] = [
  BodyPart.CHEST,
  BodyPart.BACK,
  BodyPart.LEGS,
  BodyPart.SHOULDERS,
  BodyPart.ARMS,
  BodyPart.CORE,
  BodyPart.CARDIO,
  BodyPart.FULLBODY,
  BodyPart.GLUTES
]

export const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export type CourseStatusValue = (typeof CourseStatus)[keyof typeof CourseStatus]

export const CourseStatusLabel: Record<CourseStatusValue, string> = {
  [CourseStatus.DRAFT]: '草稿',
  [CourseStatus.PUBLISHED]: '已发布',
  [CourseStatus.ARCHIVED]: '已归档'
}
