import { INestApplicationContext, Logger, WebSocketAdapter, WsMessageHandler } from '@nestjs/common'
import { empty, fromEvent, Observable, of } from 'rxjs'
import { Server, ServerOptions } from 'ws'
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators'
import { SocketEvent } from '../models'
import { isEmpty } from '../util'

export class WebsocketAdapter implements WebSocketAdapter {
  private logger = new Logger(this.constructor.name)
  constructor(private readonly app: INestApplicationContext) {
  }

  public create(port: number, options?: ServerOptions) {
    return new Server({ port, ...options })
  }

  public close(server: Server) {
    server.close()
  }

  public bindClientConnect(server: Server, callback: any): any {
    server.on('connection', callback)
  }

  public bindClientDisconnect(client, callback: any): any {
    callback(client)
  }

  public bindMessageHandlers(client, handlers: WsMessageHandler[], transform: (data: any) => Observable<any>): any {
    fromEvent(client, 'message').pipe(
      mergeMap((payload) => this.bindMessageHandler(payload, handlers, transform)),
      filter(data => data),
      map(response => client.send(JSON.stringify(response))),
      catchError(error => {
        this.logger.error(error.message)
        return of()
      })
    ).subscribe()
  }

  private bindMessageHandler(payload, handlers: WsMessageHandler[], transform: (data: any) => Observable<any>): Observable<any> {
    const message: SocketEvent = JSON.parse(payload.data)
    const messageHandler = handlers.find(handler => handler.message === message.type)

    if (isEmpty(messageHandler)) return empty()
    return transform(messageHandler.callback(message))
  }

}
