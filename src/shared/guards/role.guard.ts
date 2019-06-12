import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { IncomingMessage } from 'http'
import { JwtPayload } from '../../auth/models/auth'
import { Dictionary } from '../models'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor() {

  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: RoleIncMessage = context.switchToHttp().getRequest()


    return false
  }
}

interface RoleIncMessage extends IncomingMessage {
  user: JwtPayload
  params: Dictionary<any>
}
