import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { TracksService } from './services/track/tracks.service'
import { TracksController } from './controllers/track/tracks.controller'
import { TelemetryController } from './controllers/telemetry/telemetry.controller'

import { TelemetryService } from './services/telemetry/telemetry.service'

import { TelemetryModel } from './db'

@Module({
  controllers: [ TracksController, TelemetryController ],
  providers: [ TracksService, TelemetryService ],
  imports: [ TypegooseModule.forFeature(TelemetryModel) ]
})
export class TracksModule {}
