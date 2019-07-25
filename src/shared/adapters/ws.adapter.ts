import { INestApplicationContext, WebSocketAdapter, WsMessageHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Server, ServerOptions } from 'ws'
import { env } from '../../../environments/env'

export class WebsocketAdapter implements WebSocketAdapter {
  constructor(private readonly app: INestApplicationContext) {
    debugger
  }

  bindClientConnect(server: Server, callback: any): any {
    debugger
    server.on('connection', callback)
  }

  bindClientDisconnect(client, callback: any): any {
    debugger

  }

  bindMessageHandlers(client, handlers: WsMessageHandler[], transform: (data: any) => Observable<any>): any {
    debugger
  }

  close(server: Server) {
    debugger
    server.close()
  }

  create(port: number, options?: ServerOptions) {
    debugger
    return new Server({ port, ...options })
  }
}
