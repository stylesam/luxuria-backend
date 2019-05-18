import { Controller } from '@nestjs/common'
import { ApiUseTags } from '@nestjs/swagger'

@ApiUseTags('tracks-controller')
@Controller('tracks')
export class TracksController {

}
