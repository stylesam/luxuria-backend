import { UserController } from './user.controller'
import { UserService } from '../../services/user/user.service'
import { Test } from '@nestjs/testing'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from '../../db/user.model'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ UserController ],
      providers: [ UserService ],
      imports: [  TypegooseModule.forFeature(UserModel) ]
    }).compile()

    userController = module.get(UserController)
    userService = module.get(UserService)
  })
})
