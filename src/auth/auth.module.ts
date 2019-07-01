import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth/auth.controller'
import { AuthService } from './services/auth/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from '../user/services/user/user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '../user/db/user'
import { JwtStrategy } from './services/auth/jwt.strategy'
import { SharedModule } from '../shared/shared.module'

@Module({
  imports: [
    JwtModule.register({
      secretOrPrivateKey: 'luxuria',
      signOptions: {
        expiresIn: '1d'
      }
    }),
    TypegooseModule.forFeature(User),
    SharedModule
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, UserService, JwtStrategy ]
})
export class AuthModule {}
