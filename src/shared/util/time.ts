import * as dayjs from 'dayjs'
import 'dayjs/plugin/isBetween'

export function getCurrentISOTime() {
  return dayjs().toISOString()
}

export function getCurrentTime() {
  return dayjs().unix()
}

export function dayjsFactory(value) {
  return dayjs(value)
}
