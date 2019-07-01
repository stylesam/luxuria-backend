import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { UserController } from './controllers/user/user.controller'
import { UserService } from './services/user/user.service'
import { User } from './db/user'
import { SharedModule } from '../shared/shared.module'

@Module({
  controllers: [ UserController ],
  providers: [ UserService ],
  exports: [ UserService ],
  imports: [
    TypegooseModule.forFeature(User),
    SharedModule
  ]
})
export class UserModule {}
