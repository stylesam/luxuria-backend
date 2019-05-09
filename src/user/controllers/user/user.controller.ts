import { Body, Controller, Get, HttpCode, HttpStatus, OnModuleDestroy, Post, Res } from '@nestjs/common'
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { User } from '../../models/user'
import { Response } from 'express'
import { UserService } from '../../services/user/user.service'
import { Subject, Subscription, of } from 'rxjs'
import { unsubscribe } from '../../../shared/util'
import { catchError, tap } from 'rxjs/operators'

@ApiUseTags('authors-controller')
@Controller('users')
export class UserController implements OnModuleDestroy {
  private userSubscription: Subscription = new Subscription()

  public constructor(private userService: UserService) {

  }

  @ApiOperation({ title: 'Создать пользователя' })
  @ApiBearerAuth()
  @Post()
  public async create(@Body() userDTO: User, @Res() response: Response) {
    const user$ = this.userService.create(userDTO).pipe(
      tap((user: User) => response.status(HttpStatus.CREATED).json(user)),
      catchError((error) => of(error).pipe(
        tap(error => response.status(HttpStatus.CONFLICT).json(error))
      ))
    )

    this.userSubscription.add(user$.subscribe())
  }

  @ApiOperation({ title: 'Получить всех пользователей' })
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  public getAll(@Res() response: Response) {
    const users$ = this.userService.getAll().pipe(
      tap((users) => response.json(users))
    )

    this.userSubscription.add(users$.subscribe())
  }

  public delete() {

  }

  public onModuleDestroy() {
    unsubscribe(this.userSubscription)
  }
}
