import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { JwtModule } from '@nestjs/jwt'

import { GeoPositionGateway } from './gateways/geoPositionGateway'

import { Telemetry } from '../tracks/db'
import { SpotModule } from './modules/spot/spot.module'

import { TelemetryService } from '../tracks/services/telemetry/telemetry.service'
import { CompressorService } from './services/compressor/compressor.service'
import { JdenticonService } from './services/jdenticon/jdenticon.service'
import { ImageStoreService } from './services/image-store/image-store.service'

@Module({
  providers: [
    TelemetryService,
    GeoPositionGateway,
    CompressorService,
    JdenticonService,
    ImageStoreService
  ],
  imports: [
    TypegooseModule.forFeature(Telemetry),
    SpotModule,
    JwtModule.register({
      secretOrPrivateKey: 'luxuria',
      signOptions: {
        expiresIn: '1d'
      }
    }),
  ],
  exports: [
    CompressorService,
    JdenticonService,
    ImageStoreService
  ]
})
export class SharedModule {}
