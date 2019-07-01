import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as morgan from 'morgan'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { env } from '../env'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true })

  app.use(morgan('dev'))
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/'
  })

  const options = new DocumentBuilder()
    .setTitle('Acedia Blog API')
    .setDescription('REST API for my blog')
    .setContactEmail('stylesam@yandex.ru')
    .setVersion(env.version)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  const swaggerPath = 'api-doc'

  SwaggerModule.setup(swaggerPath, app, document)

  console.log(`Swagger doc started on http://${env.server.host}:${env.server.port}/${swaggerPath}`)

  await app.listen(env.server.port)
}

bootstrap()
