import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthDTO, JwtPayload } from '../../models/auth'
import { combineLatest, of } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'
import { UserService } from '../../../user/services/user/user.service'
import { UserDTO } from '../../../user/models/user'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
              private userService: UserService) {
  }

  public sign(payload: AuthDTO) {
    return of(payload).pipe(
      switchMap((payload) => this.userService.getOneByLogin(payload.login)),
      map(user => ({ ...user, _id: user._id.toString() })),
      map((user: UserDTO) => ({
        userId: user._id,
        accessToken: this.jwtService.sign(<JwtPayload>{ role: user.role, userId: user._id })
      }))
    )
  }

  public validateUser({ userId, role }: any) {
    return combineLatest([
      this.userService.isExistUser(userId),
      this.userService.getOneById(userId).pipe(
        map((user) => user.role === role)
      )
    ])
  }
}
