import { JwtPayload } from '../../auth/models/auth'

export { Request } from 'express'

export interface AuthedRequest extends Request {
  user: JwtPayload
}
