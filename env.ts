import * as appinfo from './package.json'

export const env = (() => {
  const baseConfig = {
    version: appinfo.version
  }

  if (process.env.NODE_ENV === 'heroku_production') {
    return {
      ...baseConfig,
      server: {
        port: process.env.PORT || 3000,
        host: 'https://luxuria.herokuapp.com/'
      },
      database: {
        login: 'stylesam',
        password: '4NB*UKaeYp_f-JKpLPU9Rxf&RqHc7PjR',
        name: 'heroku_rp6g5jrf',
        port: '47707',
        host: 'ds347707.mlab.com'
      }
    }
  }

  return {
    ...baseConfig,
    server: {
      port: process.env.PORT || 8080,
      host: 'localhost'
    },
    database: {
      name: 'luxuria',
      port: '27017',
      host: 'localhost'
    }
  }
})()

export const DATABASE_URL = ((env) => {
  if (process.env.NODE_ENV === 'heroku_production') {
    return `mongodb://${env.database.login}:${env.database.password}@${env.database.host}:${env.database.port.toString()}/${env.database.name}`
  }

  return `mongodb://${env.database.host}:${env.database.port.toString()}/${env.database.name}`
})(env)

/**
 * Интервал обновления состояний НОв
 *
 * в секундах
 */
export const STATES_UPDATE_INTERVAL = 10
