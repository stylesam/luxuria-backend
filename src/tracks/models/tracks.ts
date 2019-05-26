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

export interface RawTelemetryItem extends TelemetryDTOItem {
  userId: string
}

export interface RawState {
  userId: ObjectId,
  state: TelemetryDTOItem
}

export interface State extends TelemetryDTOItem {
  userId: ObjectId
}
