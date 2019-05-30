import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../../models/auth'
import { of } from 'rxjs'
import { take, tap, map, switchMap } from 'rxjs/operators'
import { getCurrentTime } from '../../../shared/util'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: 'luxuria',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  public validate(payload: JwtPayload) {
    of(payload).pipe(
      take(1),
      map((payload) => {
        if (payload.exp > getCurrentTime())return payload

        throw new UnauthorizedException('Token has expired')
      }),
      switchMap((payload) => this.authService.validateUser(payload)),
      map(([ isExistUser, isRoleValid ]: [ boolean, boolean ]) => {
        if (!(isExistUser && isRoleValid)) {
          throw new UnauthorizedException('User does not exist or role does not match')
        }
      })
    ).subscribe()

    return payload
  }
}
