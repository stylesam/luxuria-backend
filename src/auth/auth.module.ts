import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth/auth.controller'
import { AuthService } from './services/auth/auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { UserService } from '../user/services/user/user.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '../user/db/user'
import { JwtStrategy } from './services/auth/jwt.strategy'

@Module({
  imports: [
    JwtModule.register({
      secretOrPrivateKey: 'luxuria',
      signOptions: {
        expiresIn: '1d'
      }
    }),
    TypegooseModule.forFeature(User)
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, UserService, JwtStrategy ]
})
export class AuthModule {}
