import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from '../../db/user.model'
import { ModelType } from 'typegoose'
import { User } from '../../models/user'
import { hashSync } from 'bcrypt'
import { of, from } from 'rxjs'
import { catchError, map, switchMap, tap, toArray } from 'rxjs/operators'
import { Document } from 'mongoose'

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private userModel: ModelType<User>) {
  }

  public create(user: User) {
    return of(user).pipe(
      map((user: User) => ({ ...user, password: hashSync(user.password, 10) })),
      map((user: User) => new this.userModel(user)),
      switchMap((user) => from(user.save()).pipe(
        map((userDoc: Document) => userDoc.toObject()),
        map((user: User) => this.filterUserData(user))
      ))
    )
  }

  public getAll() {
    return from(this.userModel.find().lean()).pipe(
      switchMap(users => from(users).pipe(
        map((user: User) => this.filterUserData(user))
      )),
      toArray()
    )
  }

  private filterUserData(user: User) {
    const { password, friends, __v, ...filteredUser } = user

    return filteredUser
  }
}
