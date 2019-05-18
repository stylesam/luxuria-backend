import { prop, Ref, Typegoose } from 'typegoose'
import { UserModel } from '../../user/db/user.model'
import { getCurrentTime } from '../../shared/util'

export class TelemetryModel extends Typegoose {

  @prop({ ref: UserModel, required: true })
  userId: Ref<UserModel>

  @prop({ required: true })
  clientFixTime: number

  @prop({ default: getCurrentTime() })
  serverFixTime: number

  @prop({ required: true })
  longitude: number

  @prop({ required: true })
  latitude: number

  @prop({ default: 0 })
  altitude: number

  /**
   * Speed in meters per seconds
   *
   * Are same https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/speed
   */
  @prop({ default: null })
  speed: number

  /**
   * Direction of move (in degrees)
   * 0 is a North (determined clockwise)
   *
   * Are same https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/heading
   */
  @prop({ default: null })
  course: number
}
