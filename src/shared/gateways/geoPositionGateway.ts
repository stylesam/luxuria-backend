import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Client } from 'socket.io'
import { Logger } from '@nestjs/common'
import { defer, Subject, Subscription } from 'rxjs'
import { filter, pluck, takeUntil, tap, withLatestFrom } from 'rxjs/operators'

import { TelemetryService } from '../../tracks/services/telemetry/telemetry.service'
import { RawTelemetryItem, State } from '../../tracks/models'
import { isEmpty, isEmptyArray } from '../util'

@WebSocketGateway(8801)
export class GeoPositionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server

  private destroy$ = new Subject()
  private logger = new Logger('GeoPositionGateway')
  private socketEvents = new Subject<Action>()
  private subsStore: Subscription[] = []

  private states$ = defer(() => this.socketEvents.pipe(
    takeUntil(this.destroy$),
    filter((action) => action.type === 'states'),
    withLatestFrom(this.telemetryService.getAllLastTelemetries()),
    filter(([ _, states ]: [ Action, State[] ]) => !isEmpty(states) && !isEmptyArray(states)),
    tap(([ _, states ]: [ Action, State[] ]) => this.server.emit('states', states))
  ))

  private telemetries$ = defer(() => this.socketEvents.pipe(
    takeUntil(this.destroy$),
    filter((action) => action.type === 'telemetries'),
    pluck('payload'),
    tap((telemetry: RawTelemetryItem) => this.telemetryService.pushTelemetryItem(telemetry))
  ))

  @SubscribeMessage('telemetries')
  public handleMessage(client: Client, telemetry: RawTelemetryItem) {
    this.socketEvents.next(new EmitTelemetry(telemetry))
  }

  public emitStates() {
    this.socketEvents.next(new EmitState())
  }

  public handleConnection(client, ...args: any[]) {
    if (!isEmptyArray(this.subsStore)) return

    this.subsStore.push(
      this.states$.subscribe(),
      this.telemetries$.subscribe()
    )

    this.logger.log('WS Connected')
  }

  public handleDisconnect(client: Client) {
    this.destroy$.next()
    this.destroy$.complete()

    this.subsStore = []
  }

  public constructor(private telemetryService: TelemetryService) {
  }
}

interface Action {
  readonly type: string
  payload?: any
}

class EmitState implements Action {
  readonly type = 'states'
}

class EmitTelemetry implements Action {
  readonly type = 'telemetries'

  constructor(public payload: RawTelemetryItem) {}
}
