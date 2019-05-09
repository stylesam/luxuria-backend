import { arrayProp, prop, Ref, Typegoose } from 'typegoose'
import { IsEmail, IsPhoneNumber, IsString, IsUrl } from 'class-validator'
import * as dayjs from 'dayjs'

export class Social {

  @IsString()
  name: string

  @IsUrl()
  url: string
}

export class UserModel extends Typegoose {

  @prop({ required: true, unique: true, lowercase: true })
  login: string

  @prop({ required: true })
  password: string

  @prop({ required: true })
  name: string

  @prop({ required: true, unique: true })
  @IsPhoneNumber('RU')
  phone: string

  @prop({ default: '' })
  lastName: string

  @prop({ default: '' })
  @IsEmail()
  email: string

  @arrayProp({ items: Object, default: [] })
  socials: Social[]

  @arrayProp({ itemsRef: UserModel, default: [] })
  friends: Ref<UserModel>[]

  @prop({
    get default() {
      return dayjs().toISOString()
    }
  })
  createdAt: string

  @prop({
    get default() {
      return dayjs().toISOString()
    }
  })
  updatedAt: string

  @prop()
  get fullName() {
    return `${this.name} ${this.lastName}`
  }
}
