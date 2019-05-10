/*
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { isEmptyObject } from '../../../shared/util'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: '!Ld9SiGzON*pIwLtfp0J',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  public async validate(payload) {
    const author = await this.authService.validateAuthor(payload)
    if (isEmptyObject(author)) throw new UnauthorizedException()

    return author
  }
}
*/
