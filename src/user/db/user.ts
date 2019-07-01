import { arrayProp, prop, Ref, Typegoose } from 'typegoose'
import { IsEmail, IsString, IsUrl } from 'class-validator'
import { getCurrentTime } from '../../shared/util'
import { UserBackground, UserBackgroundType, UserRole } from '../models/user'
import { Coordinate } from 'src/shared/models'

export class Social {

  @IsString()
  name: string

  @IsUrl()
  url: string
}

export class GeoZoneModel {

  @prop({ unique: true })
  id: number

  @prop({ required: true })
  name: string

  @prop({ required: true })
  color: string

  @prop({ default: 0 })
  area?: number

  @prop({ default: 0 })
  perimeter?: number

  @prop({ required: true })
  coordinates: Coordinate[]
}

export class User extends Typegoose {

  @prop({ required: true, unique: true, lowercase: true, validate: /^[a-z0-9_-]{2,16}$/ })
  login: string

  @prop({ required: true })
  password: string

  @prop({ required: true })
  name: string

  @prop({ required: true, unique: true })
  phone: string

  @prop({ default: '' })
  lastName: string

  @prop({ default: '', validate: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i })
  @IsEmail()
  email: string

  @arrayProp({ items: Object, default: [] })
  socials: Social[]

  @arrayProp({ itemsRef: User, default: [] })
  friends: Ref<User>[]

  @prop({ default: getCurrentTime() })
  createdAt: number

  @prop({ default: getCurrentTime() })
  updatedAt: number

  @prop({ enum: UserRole, default: UserRole.user })
  role: UserRole

  @arrayProp({ items: GeoZoneModel })
  zones: GeoZoneModel[]

  @prop({ required: true, trim: true })
  avatar: string

  @prop({
    default: <UserBackground>{
      type: UserBackgroundType.color,
      value: '#000'
    }
  })
  background: UserBackground
}
