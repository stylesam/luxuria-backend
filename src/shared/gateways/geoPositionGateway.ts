import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Logger, UseGuards } from '@nestjs/common'
import { defer, Subject, Subscription } from 'rxjs'
import { filter, pluck, takeUntil, tap } from 'rxjs/operators'

import { TelemetryService } from '../../tracks/services/telemetry/telemetry.service'
import { RawTelemetryItem, State } from '../../tracks/models'
import { isEmptyArray } from '../util'
import { SocketEventType } from '../models'
import { AuthGuard } from '@nestjs/passport'
import { Server } from 'ws'

@WebSocketGateway(8081, {
  path: '/states'
})
export class GeoPositionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server
  private destroy$ = new Subject()
  private logger = new Logger(this.constructor.name)
  private socketEvents$ = new Subject<Action>()
  private subsStore: Subscription[] = []

  private states$ = defer(() => this.socketEvents$.pipe(
    takeUntil(this.destroy$),
    filter((action) => action.type === SocketEventType.states)
    // withLatestFrom(this.telemetryService.getAllLastTelemetries()),

    /* filter(([ _, states ]: [ Action, State[] ]) => !isEmpty(states) && !isEmptyArray(states)),
    tap(([ _, states ]: [ Action, State[] ]) => this.server.emit('states', states)) */
  ))

  private telemetries$ = defer(() => this.socketEvents$.pipe(
    takeUntil(this.destroy$),
    filter((action) => action.type === SocketEventType.telemetries),
    pluck('payload'),
    tap((telemetry: RawTelemetryItem) => this.telemetryService.pushTelemetryItem(telemetry))
  ))

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage(SocketEventType.telemetries)
  public handleMessage(client, telemetry: RawTelemetryItem) {
    debugger
    this.socketEvents$.next(new EmitTelemetry(telemetry))
  }

  public emitStates() {
    this.socketEvents$.next(new EmitState())
  }

  public handleConnection(client, ...args: any[]) {
    if (!isEmptyArray(this.subsStore)) return
    this.logger.log('Websocket connected')

    this.subsStore.push(
      this.states$.subscribe(),
      this.telemetries$.subscribe()
    )
  }

  public handleDisconnect(client) {
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
  readonly type = SocketEventType.states
}

class EmitTelemetry implements Action {
  readonly type = SocketEventType.telemetries

  constructor(public payload: RawTelemetryItem) {}
}
