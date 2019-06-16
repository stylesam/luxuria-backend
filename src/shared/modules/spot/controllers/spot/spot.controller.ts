import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import { SpotService } from '../../services/spot/spot.service'
import { SpotDTO } from '../../models'
import { AuthGuard } from '@nestjs/passport'
import { OnlyAdminGuard } from '../../../../guards/only-admin.guard'

@ApiUseTags('spot-controller')
@Controller('spots')
export class SpotController {
  constructor(private spotService: SpotService) {

  }

  @ApiOperation({ title: 'Создать спот' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Post()
  private create(@Body() spot: SpotDTO) {
    return this.spotService.create(spot)
  }

  @ApiOperation({ title: 'Получить все споты' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  private getAll() {
    return this.spotService.getAll()
  }

  @ApiOperation({ title: 'Получить спот по Id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  private getOne(@Param('id') id: string) {
    return this.spotService.getOneById(id)
  }

  @ApiOperation({ title: 'Обновить спот по Id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Patch(':id')
  private updateOne(@Param('id') id: string, @Body() spot: SpotDTO) {
    return this.spotService.updateById(id, spot)
  }

  @ApiOperation({ title: 'Удалить спот по Id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @Delete(':id')
  private deleteOne(@Param('id') id: string) {
    return this.spotService.deleteOne(id)
  }
}
