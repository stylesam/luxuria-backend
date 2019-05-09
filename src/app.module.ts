import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { env } from '../env'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypegooseModule.forRoot(
      `mongodb://${env.database.host}:${env.database.port.toString()}/${env.database.name}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      }),
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
