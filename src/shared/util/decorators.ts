import { createParamDecorator } from '@nestjs/common'
import { AuthedRequest } from '../models'

export const Requester = createParamDecorator((data: any, request: AuthedRequest) => request.user)
