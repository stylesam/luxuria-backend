import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from 'typegoose'
import { from, of, iif, Observable } from 'rxjs'
import { map, switchMap, tap, toArray } from 'rxjs/operators'

import { Telemetry } from '../../db'
import { State, TelemetryDTO, TelemetryDTOItem } from '../../models'
import { getCurrentTime } from '../../../shared/util'
import { ObjectId } from 'bson'

@Injectable()
export class TelemetryService {
  public constructor(@InjectModel(Telemetry) private telemetryModel: ModelType<TelemetryDTO>) {
  }

  public createTelemetryPost(telemetry: TelemetryDTO) {
    return of(telemetry).pipe(
      map((telemetry) => new this.telemetryModel(telemetry)),
      switchMap((telemetryModel) => from(telemetryModel.save()))
    )
  }

  public pushTelemetryItem(userId: string, telemetryItem: TelemetryDTOItem) {
    const saveNewTelemetryItem$ = from(this.telemetryModel.findOneAndUpdate({ userId }, {
      $push: { content: telemetryItem },
      $min: { firstTelemetryFixTime: telemetryItem.clientFixTime },
      $max: { lastTelemetryFixTime: telemetryItem.clientFixTime }
    }))

    const createTelemetryPost$ = of<TelemetryDTO>({
      userId,
      createdAt: getCurrentTime(),
      lastTelemetryFixTime: getCurrentTime(),
      firstTelemetryFixTime: getCurrentTime(),
      content: []
    }).pipe(
      switchMap((telemetryPost: TelemetryDTO) => this.createTelemetryPost(telemetryPost)),
      switchMap(() => saveNewTelemetryItem$)
    )

    return of(telemetryItem).pipe(
      switchMap(() => this.isExistTelemetryPostOfUser(userId)),
      switchMap((isExistTelemetry) => iif(() => isExistTelemetry, saveNewTelemetryItem$, createTelemetryPost$))
    )
  }

  public getTelemetriesByUserId(userId: string, fromTime: number, to: number) {
    return from(this.telemetryModel.findOne({
      userId,
      content: {
        $elemMatch: {
          clientFixTime: {
            $gte: fromTime,
            $lte: to
          }
        }
      }
    }).lean()).pipe(
      tap(data => {debugger})
    )
  }

  public getOneLastTelemetry(userId: string): Observable<TelemetryDTOItem> {
    return from(this.telemetryModel.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $project: {
        _id: 0,
        state: { $arrayElemAt: [ '$content', -1 ] }
      } }
    ])).pipe(
      map((telemetry) => telemetry[ 0 ].state)
    )
  }

  public getAllLastTelemetries() {
    return from(this.telemetryModel.aggregate([
      { $project: {
        _id: 0,
        userId: 1,
        state: { $arrayElemAt: [ '$content', -1 ] }
      } }
    ])).pipe(
      switchMap((states: State[]) => from(states).pipe(
        map((state: State) => ({ userId: state.userId, ...state.state }))
      )),
      toArray()
    )
  }

  public deleteTelemetriesByUserId(userId: string, fromTime: number, to: number) {
    return from(this.telemetryModel.deleteMany({ userId, clientFixTime: { $gte: fromTime, $lte: to } }))
  }

  private isExistTelemetryPostOfUser(userId: string) {
    return from(this.telemetryModel.countDocuments({ userId })).pipe(
      map((count: number) =>  count > 0)
    )
  }
}
