import { safeLoadAll } from 'js-yaml'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as appPackage from '../package.json'

const config = safeLoadAll(readFileSync(join(__dirname, `${process.env.NODE_ENV}.yaml`), { encoding: 'utf-8', flag: 'r' }))[ 0 ]

export enum NodeEnv {
  development = 'dev',
  production = 'prod'
}

export interface Environment {
  server: {
    port: number
    host: string
  }

  database: {
    name: string
    port: number
    host: string
    login?: string
    password?: string
  }

  appVersion: number
  mongoUrl: string
}

export class Env {
  private static nodeEnv = <NodeEnv>process.env.NODE_ENV
  private static instance: Env
  private static config: Environment = {
    appVersion: appPackage.version,
    mongoUrl: Env.getMongo(),
    ...config
  }

  private static getMongo() {
    const database = Env.get('database')

    switch (Env.nodeEnv) {
      case NodeEnv.development:
        return `mongodb://${database.host}:${database.port.toString()}/${database.name}`
      case NodeEnv.production:
        return `mongodb://${database.login}:${database.password}@${database.host}:${database.port.toString()}/${database.name}`
    }
  }

  private constructor() {}

  public static getInstance() {
    if (!Env.instance) {
      Env.instance = new Env()
    }
    return Env.instance
  }

  public static get(key: string) {
    return Env.config[ key ]
  }
}
