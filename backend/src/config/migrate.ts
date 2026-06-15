import { prisma } from './database'
import { logger } from '../utils/logger'

interface ColumnCheckRow {
  cnt: bigint | number
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<ColumnCheckRow[]>(
    `SELECT COUNT(*) AS cnt
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = ?
       AND COLUMN_NAME  = ?
     LIMIT 1`,
    table,
    column
  )
  const row = rows?.[0]
  const count = typeof row?.cnt === 'bigint' ? Number(row.cnt) : Number(row?.cnt ?? 0)
  return count > 0
}

async function ensureCourseBodyParts() {
  const exists = await columnExists('courses', 'body_parts')
  if (exists) {
    logger.info('MIGRATION_SKIP', { migration: '001_add_course_body_parts', reason: 'column_already_exists' })
    return
  }
  await prisma.$executeRawUnsafe(
    `ALTER TABLE courses
       ADD COLUMN body_parts JSON NULL
       COMMENT '训练部位标签，值为 chest|back|legs|shoulders|arms|core|cardio|fullbody|glutes 的数组'`
  )
  logger.info('MIGRATION_APPLY', { migration: '001_add_course_body_parts', detail: 'added courses.body_parts JSON NULL' })
}

export async function runMigrations() {
  logger.info('MIGRATION_START', { step: 'preflight' })
  try {
    await ensureCourseBodyParts()
    logger.info('MIGRATION_DONE', { step: 'preflight' })
  } catch (error) {
    logger.error('MIGRATION_FAILED', {
      step: 'preflight',
      message: error instanceof Error ? error.message : String(error)
    })
    throw error
  }
}
