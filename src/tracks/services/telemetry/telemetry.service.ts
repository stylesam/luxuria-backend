import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from 'typegoose'

import { TelemetryModel } from '../../db'
import { Telemetry } from '../../models'
import { map, switchMap, filter, tap, toArray } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { dayjsFactory } from '../../../shared/util'

@Injectable()
export class TelemetryService {
  public constructor(@InjectModel(TelemetryModel) private telemetryModel: ModelType<Telemetry>) {

  }

  public createTelemetry(telemetry: Telemetry) {
    return of(telemetry).pipe(
      map((telemetry) => new this.telemetryModel(telemetry)),
      switchMap((telemetry) => from(telemetry.save()))
    )
  }

  public getTelemetriesByUserId(userId: string, fromTime: number, to: number) {
    const preparedFromTime = dayjsFactory(fromTime)
    const preparedToTime = dayjsFactory(to)

    return from(this.telemetryModel.find({ userId }).lean()).pipe(
      tap(data => {debugger}),
      switchMap((telemetries: Telemetry[]) => from(telemetries).pipe(
        filter((telemetry: Telemetry) => dayjsFactory(telemetry.clientFixTime).isBetween(preparedFromTime, preparedToTime, 'second', '[]'))
      )),
      toArray()
    )
  }

  public deleteTelemetriesByUserId(userId: string, fromTime: number, to: number) {
    return from(this.telemetryModel.deleteMany({ userId, clientFixTime: { $gte: fromTime, $lte: to } }))
  }
}
