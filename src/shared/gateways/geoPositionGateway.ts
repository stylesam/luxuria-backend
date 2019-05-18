import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Client } from 'socket.io'
import { Logger } from '@nestjs/common'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { Telemetry } from '../../tracks/models'
import { TelemetryService } from '../../tracks/services/telemetry/telemetry.service'

@WebSocketGateway(8801)
export class GeoPositionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private destroy$ = new Subject()
  private logger = new Logger('GeoPositionGateway')

  @WebSocketServer() public server: Server

  @SubscribeMessage('telemetries')
  public handleMessage(client: Client, telemetry: Telemetry) {
    this.telemetryService.createTelemetry(telemetry).pipe(
      takeUntil(this.destroy$)
    ).subscribe()
  }

  public handleConnection(client, ...args: any[]): any {
    this.logger.log('WS Connected')
    client.emit('connection', 'connected')
  }

  public handleDisconnect(client: Client): any {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public constructor(private telemetryService: TelemetryService) {
  }

}
