import { Role } from '../../shared/database/db-models/author'
import { ApiModelProperty } from '@nestjs/swagger'

export class JwtPayloadDTO {
  
  @ApiModelProperty({
    description: 'Никнейм автора',
    required: true,
    example: 'stylesam'
  })
  nick: string
  
  @ApiModelProperty({
    description: 'Роль автора',
    required: true,
    example: 'admin',
    enum: [ Role.Admin, Role.Author ]
  })
  role: Role

  @ApiModelProperty({
    description: 'Пароль автора',
    required: true
  })
  password: string
}