import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { map, switchMap } from 'rxjs/operators'

import { CanCommand, GeoZone, UserDTO } from '../../models/user'
import { UserService } from '../../services/user/user.service'
import { isEmpty, Requester } from '../../../shared/util'
import { AuthGuard } from '@nestjs/passport'
import { JwtPayload } from '../../../auth/models/auth'
import { filter } from 'rxjs/internal/operators/filter'
import { iif, throwError } from 'rxjs'

@ApiUseTags('users-controller')
@Controller('users')
export class UserController {
  public constructor(private userService: UserService) {
  }

  @ApiOperation({ title: 'Создать пользователя' })
  @ApiBearerAuth()
  @Post()
  private create(@Body() user: UserDTO) {
    return this.userService.create(user)
  }

  @ApiOperation({ title: 'Получить всех пользователей' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(HttpStatus.OK)
  private getAll() {
    return this.userService.getAll()
  }

  @ApiOperation({ title: 'Получить пользователя по ID' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  private getOne(@Param('id') id: string) {
    return this.userService.getOneById(id)
  }

  @ApiOperation({ title: 'Обновить пользователя' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  private update(@Requester() requester: JwtPayload, @Param('id') id: string, @Body() userDTO: UserDTO) {
    const checkRoleAndUpdate$ = this.userService.getOneById(id).pipe(
      filter(() => {
        if (isEmpty(userDTO.role)) throw new BadRequestException('You are not allowed to update anything other than the role')
        return true
      }),
      filter(() => {
        if (!this.userService.can(CanCommand.update, requester)) {
          throw new BadRequestException('You are not allowed to update role for that user')
        }

        return true
      }),
      switchMap(() => this.userService.updateById(id, userDTO))
    )

    return iif(() => requester.userId === id && !isEmpty(userDTO.role),
      throwError(new BadRequestException('You can not update your role')),
      iif(() => requester.userId === id, this.userService.updateById(id, userDTO), checkRoleAndUpdate$)
    )
  }

  @ApiOperation({ title: 'Удалить пользователя' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  private delete(@Param('id') id: string, @Requester() requester: JwtPayload) {
    return this.userService.getOneById(id).pipe(
      filter((updateabler: UserDTO) => {
        if (!this.userService.can(CanCommand.delete, requester, updateabler)) {
          throw new BadRequestException('You are not allowed to delete that user')
        }

        return true
      }),
      switchMap(() => this.userService.deleteById(id))
    )

  }

  @ApiOperation({ title: 'Получить список друзей пользователя по ID' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/friends')
  @HttpCode(HttpStatus.OK)
  private getFriends(@Param('id') id: string) {
    return this.userService.getAllFriends(id)
  }

  @ApiOperation({ title: 'Добавить друга в список друзей' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/friends')
  @HttpCode(HttpStatus.OK)
  private addFriend(@Param('id') id: string, @Query('candidateFriendId') candidateFriendId: string) {
    if (id === candidateFriendId) throw new HttpException('You can not add yourself to friends', HttpStatus.CONFLICT)

    return this.userService.addUserToFriendList(id, candidateFriendId)
  }

  @ApiOperation({ title: 'Удалить друга из списка друзей' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/friends')
  @HttpCode(HttpStatus.OK)
  private deleteFriend(@Param('id') id: string, @Query('candidateFriendId') candidateFriendId: string) {
    if (id === candidateFriendId) throw new BadRequestException('Ids can not match')

    return this.userService.deleteUserFromFriendList(id, candidateFriendId).pipe(
      map((data) => {
        if (!isEmpty(data)) {
          return { statusCode: 200, success: true, message: 'UserDTO has been deleted' }
        }

        throw new BadRequestException('UserDTO with that ID does not exist')
      })
    )
  }

  @ApiOperation({ title: 'Добавить геозону' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/zones')
  private createZone(@Param('id') id: string, @Body() zone: GeoZone) {
    return this.userService.createGeoZone(id, zone)
  }

  @ApiOperation({ title: 'Получить все зоны пользователя' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/zones')
  private getAllZones(@Param('id') id: string) {
    return this.userService.getAllZones(id)
  }

  @ApiOperation({ title: 'Получить зону по id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/zones/:zoneId')
  private getZone(@Param('id') id: string, @Param('zoneId') zoneId: string) {
    return this.userService.getZoneById(id, zoneId)
  }

  @ApiOperation({ title: 'Обновить зону по id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/zones/:zoneId')
  private updateZone(@Param('id') id: string, @Param('zoneId') zoneId: string, @Body() zone: GeoZone) {
    // todo: Исправть обноваление данных зон
    return this.userService.updateZoneById(id, zoneId, zone)
  }

}
