export class Telemetry {
  userId: string
  clientFixTime: number
  longitude: number
  latitude: number
  altitude?: number
  speed?: number
  serverFixTime?: number
  course?: number
}

export interface TimeInterval {
  from: number
  to: number
}
