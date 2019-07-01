import { Injectable } from '@nestjs/common'
// @ts-ignore
import { sharp } from 'sharp'
import { from } from 'rxjs'

@Injectable()
export class CompressorService {
  constructor() {

  }

  public compress(avatar: Buffer) {
    return from(sharp(avatar)
      .png({
        compressionLevel: 0.5
      })
      .toBuffer()
    )
  }
}
