import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as morgan from 'morgan'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { env } from '../env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(morgan('dev'))

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
