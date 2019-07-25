import { safeLoadAll } from 'js-yaml'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as appPackage from '../package.json'

export enum NodeEnv {
  development = 'dev',
  production = 'prod'
}

class Env {
  private nodeEnv = <NodeEnv>process.env.NODE_ENV
  private config = {
    appVersion: appPackage.version,
    ...this.getYamlConfig()
  }

  public setMongo() {
    const database = this.get('database')
    let url

    if (this.nodeEnv === NodeEnv.development) {
      url = `mongodb://${database.host}:${database.port.toString()}/${database.name}`
    }

    if (this.nodeEnv === NodeEnv.production) {
      url = `mongodb://${database.login}:${database.password}@${database.host}:${database.port.toString()}/${database.name}`
    }

    this.config = {
      ...this.config,
      mongoUrl: url
    }
  }

  private getYamlConfig() {
    return safeLoadAll(readFileSync(join(__dirname, `${process.env.NODE_ENV}.yaml`), { encoding: 'utf-8', flag: 'r' }))[ 0 ]
  }

  constructor() {
  }

  public get(key: string) {
    return this.config[ key ]
  }
}

export const env = new Env()
env.setMongo()
