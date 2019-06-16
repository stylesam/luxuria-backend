import { ApiModelProperty } from '@nestjs/swagger'
import { ObjectId } from 'bson'
import { Coordinate } from '../../shared/models'
import { GeoZoneModel } from '../db/user'

export enum UserRole {
  admin = 'ADMIN',
  superUser = 'SUPER_USER',
  user = 'USER'
}

export enum UserRolePriority {
  USER = 1,
  SUPER_USER = 2,
  ADMIN = 3
}

export enum CanCommand {
  update = 'UPDATE',
  delete = 'DELETE'
}

export enum UserBackgroundType {
  image = 'IMAGE',
  color = 'COLOR'
}

export interface UserBackground {
  type: UserBackgroundType
  value: string
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

export class GeoZone {
  @ApiModelProperty({
    description: 'ID',
    example: '5cd433c27446e41be07c6ffa'
  })
  _id?: ObjectId | string

  @ApiModelProperty({
    description: 'Имя зоны',
    example: 'Драма'
  })
  name?: string

  @ApiModelProperty({
    description: 'Цвет зоны',
    example: 'RED'
  })
  color?: string

  @ApiModelProperty({
    description: 'Координаты',
    example: [
      { lat: 0, lng: 0 }
    ]
  })
  coordinates?: Coordinate[]

  @ApiModelProperty({
    description: 'Площадь в кв. м',
    example: 10
  })
  area?: number

  @ApiModelProperty({
    description: 'Периметр в м.',
    example: 2
  })
  perimeter?: number

}


export class UserDTO {

  @ApiModelProperty({
    description: 'ID',
    example: '5cd433c27446e41be07c6ffa'
  })
  _id?: string | ObjectId

  @ApiModelProperty({
    description: 'Логин',
    example: 'stylesam',
    required: true
  })
  login?: string

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
  name?: string

  @ApiModelProperty({
    description: 'Фамилия',
    example: 'Булатов'
  })
  lastName?: string

  @ApiModelProperty({
    description: 'Email',
    example: 'stylesam@yandex.ru'
  })
  email?: string

  @ApiModelProperty({
    description: 'Ссылки на соц. сети',
    isArray: true
  })
  socials?: Social[]

  @ApiModelProperty({
    description: 'Список друзей',
    isArray: true,
    default: []
  })
  friends?: (string | ObjectId)[]

  @ApiModelProperty({
    description: 'Время создания'
  })
  createdAt?: string

  @ApiModelProperty({
    description: 'Время обновления'
  })
  updatedAt?: string

  @ApiModelProperty({
    description: 'Пользовательская роль',
    example: 'USER',
    enum: [ UserRole.admin, UserRole.superUser, UserRole.user ]
  })
  role?: UserRole

  @ApiModelProperty({
    description: 'Список геозон'
  })
  zones?: GeoZoneModel[]

  @ApiModelProperty({
    description: 'Путь до аватарки'
  })
  avatar?: string | File

  @ApiModelProperty({
    description: 'Фон'
  })
  background?: UserBackground

  __v?: number
}

export interface File {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer: Buffer
}
