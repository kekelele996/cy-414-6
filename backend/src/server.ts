import { app } from './app'
import { appConfig } from './config/app'
import { runMigrations } from './config/migrate'
import { logger } from './utils/logger'

async function bootstrap() {
  await runMigrations()

  const server = app.listen(appConfig.port, () => {
    logger.info('BACKEND_START', { port: appConfig.port })
    console.log(`FitPro backend listening on ${appConfig.port}`)
  })

  process.on('SIGTERM', () => {
    server.close(() => process.exit(0))
  })
}

bootstrap().catch(err => {
  logger.error('BACKEND_BOOTSTRAP_FAILED', { message: err instanceof Error ? err.message : String(err) })
  console.error('FitPro backend failed to start:', err)
  process.exit(1)
})
