import { arrayProp, prop, Ref, Typegoose } from 'typegoose'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUrl } from 'class-validator'
import { getCurrentTime } from '../../shared/util'

export class Social {

  @IsString()
  name: string

  @IsUrl()
  url: string
}

export class User extends Typegoose {

  @prop({ required: true, unique: true, lowercase: true, validate: /^[a-z0-9_-]{2,16}$/ })
  login: string

  @prop({ required: true })
  password: string

  @IsNotEmpty()
  @prop({
    required: true
    /*validate: (value: string) => {
      debugger
      return !isEmptyAll(value)
    }*/
  })
  name: string

  @prop({ required: true, unique: true })
  @IsPhoneNumber('RU')
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

  @prop()
  get fullName() {
    return `${this.name} ${this.lastName}`
  }
}
