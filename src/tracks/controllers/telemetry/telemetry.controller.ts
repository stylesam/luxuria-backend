import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiUseTags } from '@nestjs/swagger'
import { of } from 'rxjs'

import { TelemetryDTO, TimeInterval } from '../../models'
import { TelemetryService } from '../../services/telemetry/telemetry.service'

@ApiUseTags('tracks-controller')
@Controller('tracks/telemetries')
export class TelemetryController {

  constructor(private telemetryService: TelemetryService) {
  }

  @Post()
  public create(@Body() telemetry: TelemetryDTO) {
    return this.telemetryService.createTelemetryPost(telemetry)
  }

  @Get(':id')
  public get(@Param('id') userId: string, @Query() query: TimeInterval) {
    return this.telemetryService.getTelemetriesByUserId(userId, query.from, query.to)
  }

  @Delete(':id')
  public delete(@Param('id') userId: string, @Query() query: TimeInterval) {
    return of('This method are not supported')
  }
}
