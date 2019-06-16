import { Module } from '@nestjs/common'
import { GeoPositionGateway } from './gateways/geoPositionGateway'
import { TelemetryService } from '../tracks/services/telemetry/telemetry.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { Telemetry } from '../tracks/db'
import { SpotModule } from './modules/spot/spot.module'

@Module({
  providers: [ TelemetryService, GeoPositionGateway ],
  imports: [
    TypegooseModule.forFeature(Telemetry),
    SpotModule
  ],
  exports: [
    SpotModule
  ]
})
export class SharedModule {}
