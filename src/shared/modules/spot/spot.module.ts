import { Module } from '@nestjs/common'
import { SpotService } from './services/spot/spot.service'
import { SpotController } from './controllers/spot/spot.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { Spot } from './db/spot'

@Module({
  imports: [ TypegooseModule.forFeature(Spot) ],
  providers: [ SpotService ],
  controllers: [ SpotController ]
})
export class SpotModule {}
