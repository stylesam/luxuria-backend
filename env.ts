import * as appinfo from './package.json'

export const env = {
  version: appinfo.version,
  server: {
    port: 8800,
    host: 'localhost'
  },
  database: {
    port: 27017,
    name: 'luxuria',
    host: 'localhost'
  }
}
