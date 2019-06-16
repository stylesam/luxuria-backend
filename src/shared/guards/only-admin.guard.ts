import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthedRequest } from '../models'
import { UserRole } from '../../user/models/user'

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthedRequest>()

    return req.user.role === UserRole.admin
  }
}
