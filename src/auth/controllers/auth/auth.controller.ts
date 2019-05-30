import { Controller, Post } from '@nestjs/common'
import { Body } from '@nestjs/common/decorators/http/route-params.decorator'
import { AuthDTO } from '../../models/auth'
import { AuthService } from '../../services/auth/auth.service'

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post()
  public login(@Body() payload: AuthDTO) {
    return this.authService.sign(payload)
  }

}
