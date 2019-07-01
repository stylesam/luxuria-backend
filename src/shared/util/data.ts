import { UserDTO, UserRole, UserRolePriority } from '../../user/models/user'

export function isObject(obj) {
  return typeof obj === 'object'
}

export function isArray(arr) {
  return Array.isArray(arr)
}

export function isEmptyArray(arr) {
  return isArray(arr) && arr.length === 0
}

export function isString(str) {
  return typeof str === 'string'
}

export function isEmptyString(str) {
  return isString(str) && str.length === 0
}

export function isNull(obj) {
  return obj === null
}

export function isUndefined(obj) {
  return typeof obj === 'undefined'
}

export function isEmpty(obj) {
  return isNull(obj) || isUndefined(obj)
}

export function isEmptyAll(obj) {
  return isEmpty(obj) || obj === ''
}

export function isEmptyObject(obj) {
  return !(obj && Object.keys(obj).length > 0)
}

export function getRolePriority(payload: UserDTO | UserRole) {
  if (payload instanceof UserDTO) {
    return UserRolePriority[ payload.role ]
  }

  if (isString(payload)) {
    return UserRolePriority[ payload ]
  }
}

export function fileExtension(fileName: string) {
  return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined
}
