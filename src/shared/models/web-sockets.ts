export interface SocketEvent {
  type: SocketEventType
  payload: any
}

export enum SocketEventType {
  states = 'STATES',
  telemetries = 'TELEMETRIES'
}
