import { WebSocketAdapter, WsMessageHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Server, ServerOptions } from 'ws'

export class WebsocketAdapter implements WebSocketAdapter {
  bindClientConnect(server: Server, callback: any): any {
    server.on('connection', callback)
  }

  bindClientDisconnect(client, callback: any): any {

  }

  bindMessageHandlers(client, handlers: WsMessageHandler[], transform: (data: any) => Observable<any>): any {

  }

  close(server): any {

  }

  create(port: number, options?: ServerOptions) {
    return new Server({ port, ...options })
  }

}
