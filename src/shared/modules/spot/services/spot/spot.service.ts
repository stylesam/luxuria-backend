import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Spot } from '../../db/spot'
import { ModelType } from 'typegoose'
import { SpotDTO } from '../../models'
import { of, from } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { Document } from 'mongoose'
import { MongoError } from 'mongodb'

@Injectable()
export class SpotService {
  constructor(@InjectModel(Spot) private spotModel: ModelType<SpotDTO>) {
  }

  public create(spot: SpotDTO) {
    return of(spot).pipe(
      map((spot) => new this.spotModel(spot)),
      switchMap((spotModel) => from(spotModel.save()).pipe(
        map((doc: Document) => doc.toObject({ versionKey: false }))
      )),
      catchError((error: MongoError) => of(error))
    )
  }

  public getAll() {
    return from(this.spotModel.find().lean())
  }

  public getOneById(id: string) {
    return from(this.spotModel.findById(id).lean())
  }

  public updateById(id: string, spot: SpotDTO) {
    return from(this.spotModel.findByIdAndUpdate(id, spot, { new: true }))
  }

  public deleteOne(id: string) {
    return from(this.spotModel.findByIdAndDelete(id))
  }
}
