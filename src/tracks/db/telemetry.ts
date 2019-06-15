import { arrayProp, prop, Ref, Typegoose } from 'typegoose'
import { User } from '../../user/db/user'
import { getCurrentTime } from '../../shared/util'

export class TelemetryItem {
  @prop({ required: true })
  public clientFixTime: number

  @prop({ default: getCurrentTime() })
  public serverFixTime: number

  @prop({ required: true })
  public longitude: number

  @prop({ required: true })
  public latitude: number

  @prop({ default: 0 })
  public altitude: number

  /**
   * Speed in meters per seconds
   *
   * Are same https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/speed
   */
  @prop({ default: null })
  public speed: number

  /**
   * Direction of move (in degrees)
   * 0 is a North (determined clockwise)
   *
   * Are same https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/heading
   */
  @prop({ default: null })
  public course: number
}

export class Telemetry extends Typegoose {
  @prop({ ref: User, required: true })
  public userId: Ref<User>

  @arrayProp({ items: TelemetryItem })
  public content: TelemetryItem[]

  @prop({ default: getCurrentTime() })
  public createdAt: number

  @prop({ default: getCurrentTime() })
  public firstTelemetryFixTime: number

  @prop({ default: getCurrentTime() })
  public lastTelemetryFixTime: number
}
