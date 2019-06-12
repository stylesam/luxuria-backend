import { MongoError } from 'mongodb'
import { HttpStatus } from '@nestjs/common'
import { Dictionary } from '../models'

interface LuxError {
  status: number
  message: object | string
}

export class MongoErrorHandler implements LuxError {
  public message: object | string
  public status: number

  private errors: Dictionary<LuxError> = {
    11000: {
      message: 'Duplicate key',
      status: HttpStatus.CONFLICT
    }
  }

  constructor(private error: MongoError) {
    const errorInfo = this.getInfo()
    this.status = errorInfo.status
    this.message = errorInfo.message
  }

  public getInfo() {
    return this.errors[ this.error.code ]
  }
}
