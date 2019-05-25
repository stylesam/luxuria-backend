import { ObjectId } from 'bson'

export interface TelemetryDTO {
  userId: string
  createdAt: number
  firstTelemetryFixTime: number
  lastTelemetryFixTime: number
  content: TelemetryDTOItem[]
}

export interface TelemetryDTOItem {
  clientFixTime: number
  serverFixTime?: number
  longitude: number
  latitude: number
  altitude?: number
  speed?: number
  course?: number
}

export interface TimeInterval {
  from: number
  to: number
}

export interface State {
  userId: ObjectId,
  state: TelemetryDTOItem
}
