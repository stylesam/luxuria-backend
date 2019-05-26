import { Module } from '@nestjs/common'
import { ScheduleModule } from 'nest-schedule'
import { SharedModule } from '../shared/shared.module'
import { StateScheduler } from './sсhedulers/state.sheduler'
import { TelemetryService } from '../tracks/services/telemetry/telemetry.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { Telemetry } from '../tracks/db'
import { GeoPositionGateway } from '../shared/gateways/geoPositionGateway'

@Module({
  imports: [ ScheduleModule.register(), SharedModule, TypegooseModule.forFeature(Telemetry) ],
  providers: [ StateScheduler, TelemetryService, GeoPositionGateway ]

})
export class StateModule {
}
