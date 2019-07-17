import { Injectable } from '@nestjs/common'
import { MulterFile } from '../../../user/models/user'
import { combineLatest, from, of } from 'rxjs'
import { ImageStoreType } from '../../models'
import { join } from 'path'
import { catchError, map, switchMap, tap } from 'rxjs/operators'

import { config, S3, SharedIniFileCredentials } from 'aws-sdk'

@Injectable()
export class ImageStoreService {
  private client: S3

  constructor() {
    // todo LUX-7: Перепписать способ авторизации можно это делать через переменные окружения
    config.credentials = new SharedIniFileCredentials({ profile: 'luxuria' })
    this.client = new S3({
      endpoint: 'https://storage.yandexcloud.net',
      apiVersion: 'latest'
    })
  }


  public store(storable: MulterFile, directory: string) {
    return from(this.client.upload({
      Bucket: 'luxuria',
      Body: storable.buffer,
      Key: join(directory, storable.filename),
      ACL: 'public-read',
      ContentType: storable.mimetype
    }).promise()).pipe(
      map((object) => object.Location)
    )
  }

  public get(userLogin: string, type: ImageStoreType) {

  }

  public getFile(fileName: string) {
  }
}
