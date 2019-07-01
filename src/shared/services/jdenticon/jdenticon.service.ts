import { Injectable } from '@nestjs/common'
import * as jdenticon from 'jdenticon'

@Injectable()
export class JdenticonService {
  private readonly jdenticon: any

  constructor() {
    this.jdenticon = jdenticon
    this.jdenticon.config = {
      hues: [ 179 ],
      lightness: {
        color: [ 0.46, 0.46 ],
        grayscale: [ 0.47, 0.47 ]
      },
      saturation: {
        color: 1.00,
        grayscale: 1.00
      }
    }
  }

  public generatePNG(value: string, size: number = 300): Buffer {
    return this.jdenticon.toPng(value, size)
  }

  public generateSVG(value: string, size: number = 300): string {
    return this.jdenticon.toSvg(value, size)
  }
}

