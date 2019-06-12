import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { TracksModule } from './tracks/tracks.module'
import { SharedModule } from './shared/shared.module'
import { StatesModule } from './states/states.module'

import { env } from '../env'
import { PassportModule } from '@nestjs/passport'

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
    UserModule,
    TracksModule,
    SharedModule,
    StatesModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'requester'
    })
  ]
})
export class AppModule {}
