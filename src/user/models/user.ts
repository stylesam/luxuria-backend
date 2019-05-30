import { ApiModelProperty } from '@nestjs/swagger'

export enum UserRole {
  admin = 'ADMIN',
  superUser = 'SUPER_USER',
  user = 'USER'
}

export class Social {

  @ApiModelProperty({
    description: 'Имя соц. сети',
    example: 'VK'
  })
  name: string

  @ApiModelProperty({
    description: 'Ссылка',
    example: 'https://vk.com/stylesams'
  })
  url: string
}

export class UserDTO {

  @ApiModelProperty({
    description: 'ID',
    example: '5cd433c27446e41be07c6ffa'
  })
  _id: string

  @ApiModelProperty({
    description: 'Логин',
    example: 'stylesam',
    required: true
  })
  login: string

  @ApiModelProperty({
    description: 'Пароль',
    required: true
  })
  password?: string

  @ApiModelProperty({
    description: 'Имя',
    example: 'Сэм',
    required: true
  })
  name: string

  @ApiModelProperty({
    description: 'Фамилия',
    example: 'Булатов'
  })
  lastName: string

  @ApiModelProperty({
    description: 'Email',
    example: 'stylesam@yandex.ru'
  })
  email: string

  @ApiModelProperty({
    description: 'Ссылки на соц. сети',
    isArray: true
  })
  socials: Social[]

  @ApiModelProperty({
    description: 'Список друзей',
    isArray: true,
    default: []
  })
  friends?: string[]

  @ApiModelProperty({
    description: 'Время создания'
  })
  createdAt: string

  @ApiModelProperty({
    description: 'Время обновления'
  })
  updatedAt: string

  @ApiModelProperty({
    description: 'Пользовательская роль',
    example: 'USER',
    enum: [ UserRole.admin, UserRole.superUser, UserRole.user ]
  })
  role: UserRole

  __v?: number
}
