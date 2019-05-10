import { Module } from '@nestjs/common'
import { UserController } from './controllers/user/user.controller'
import { UserService } from './services/user/user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from './db/user.model'

@Module({
  controllers: [ UserController ],
  providers: [ UserService ],
  exports: [ UserService ],
  imports: [ TypegooseModule.forFeature(UserModel) ]
})
export class UserModule {}
