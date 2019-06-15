import { UserRole } from '../../user/models/user'

export class AuthDTO {
  login: string
  password: string
}

export interface JwtPayload {
  role: UserRole,
  userId: string,
  exp: number
}
