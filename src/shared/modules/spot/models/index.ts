import { ApiModelProperty } from '@nestjs/swagger'

export class SpotDTO {

  @ApiModelProperty({
    description: 'Название спота',
    example: 2
  })
  name: string

  @ApiModelProperty({
    description: 'Координаты',
    example: { lat: 0, lng: 0 }
  })

  coordinates: Coordinates
}
