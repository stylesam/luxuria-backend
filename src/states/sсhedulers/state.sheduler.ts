import { Injectable } from '@nestjs/common'
import { NestSchedule, Interval } from 'nest-schedule'
import { GeoPositionGateway } from '../../shared/gateways/geoPositionGateway'
import { STATES_UPDATE_INTERVAL } from '../../shared/constants'

@Injectable()
export class StateScheduler extends NestSchedule {

  constructor(private geoPosition: GeoPositionGateway) {
    super()
  }

  @Interval(STATES_UPDATE_INTERVAL * 1000)
  hello() {
    this.geoPosition.emitStates()
  }
}
