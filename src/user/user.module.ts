import { Module } from '@nestjs/common'
import { UserController } from './controllers/user/user.controller'
import { UserService } from './services/user/user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './db/user'

@Module({
  controllers: [ UserController ],
  providers: [ UserService ],
  exports: [ UserService ],
  imports: [ TypegooseModule.forFeature(User) ]
})
export class UserModule {}
