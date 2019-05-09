import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from 'typegoose'
import { Document } from 'mongoose'
import { hashSync } from 'bcrypt'
import { of, from } from 'rxjs'
import { map, switchMap, toArray, pluck } from 'rxjs/operators'

import { UserModel } from '../../db/user.model'
import { User } from '../../models/user'

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

  public getOneById(id: string) {
    return from(this.userModel.findById(id).lean()).pipe(
      map((user: User) => this.filterUserData(user))
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

  public deleteById(id: string) {
    return from(this.userModel.findByIdAndDelete(id))
  }

  public updateById(id: string, user) {
    return from(this.userModel.findByIdAndUpdate(id, { $set: user }, { new: true }).lean()).pipe(
      map((user: User) => this.filterUserData(user))
    )
  }

  public getAllFriends(id: string) {
    return from(this.userModel.findById(id).populate('friends').lean()).pipe(
     pluck('friends')
    )
  }

  private filterUserData(user: User) {
    const { password, friends, __v, ...filteredUser } = user

    return filteredUser
  }
}
