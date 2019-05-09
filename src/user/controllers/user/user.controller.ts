import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Res, Param } from '@nestjs/common'
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Response } from 'express'
import { of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

import { User } from '../../models/user'
import { UserService } from '../../services/user/user.service'
import { isEmpty } from '../../../shared/util'

import { Dictionary } from '../../../shared/models'

@ApiUseTags('authors-controller')
@Controller('users')
export class UserController {
  public constructor(private userService: UserService) {

  }

  @ApiOperation({ title: 'Создать пользователя' })
  @ApiBearerAuth()
  @Post()
  public async create(@Body() userDTO: User, @Res() response: Response) {
    return this.userService.create(userDTO).pipe(
      tap((user: User) => response.status(HttpStatus.CREATED).json(user)),
      catchError((error) => of(error).pipe(
        tap(error => response.status(HttpStatus.CONFLICT).json(error))
      ))
    )
  }

  @ApiOperation({ title: 'Получить всех пользователей' })
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  public getAll(@Res() response: Response) {
    return this.userService.getAll().pipe(
      tap((users) => response.json(users))
    )
  }

  @ApiOperation({ title: 'Получить пользователя по ID' })
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public getOne(@Param('id') id: string, @Res() response: Response) {
    return this.userService.getOneById(id).pipe(
      tap((user: User) => response.json(user)),
      catchError((error) => of(error).pipe(
        tap(error => response.status(HttpStatus.CONFLICT).json(error))
      ))
    )
  }

  @ApiOperation({ title: 'Обновить пользователя' })
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public update(@Param('id') id: string, @Body() userDTO: Dictionary<any>, @Res() response: Response) {
    return this.userService.updateById(id, userDTO).pipe(
      tap((user: User) => response.json(user)),
      catchError((error) => of(error).pipe(
        tap(error => response.status(HttpStatus.CONFLICT).json(error))
      ))
    )
  }

  @ApiOperation({ title: 'Удалить пользователя' })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public delete(@Param('id') id: string, @Res() response: Response) {
    return this.userService.deleteById(id).pipe(
      tap((data) => {
        if (!isEmpty(data)) {
          response.json({ success: true, msg: 'User has been deleted' })
        } else {
          response.status(HttpStatus.BAD_REQUEST).json({ success: false, msg: 'User with that ID does not exist' })
        }
      }),
      catchError((error) => of(error).pipe(
        tap(error => response.status(HttpStatus.CONFLICT).json(error))
      ))
    )
  }

  @ApiOperation({ title: 'Получить список друзей пользователя по ID' })
  @ApiBearerAuth()
  @Get(':id/friends')
  @HttpCode(HttpStatus.OK)
  public getFriends(@Param('id') id: string) {
    return this.userService.getAllFriends(id)
  }

}
