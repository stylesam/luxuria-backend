import { prop, Typegoose } from 'typegoose'
import { Coordinate } from '../../../models'

export class Spot extends Typegoose {

  @prop({ required: true, unique: true, uppercase: true, trim: true })
  name: string

  @prop({ required: true })
  coordinates: Coordinate
}
