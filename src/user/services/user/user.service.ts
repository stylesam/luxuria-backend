import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from 'typegoose'
import { Document } from 'mongoose'
import { hashSync } from 'bcrypt'
import { of, from } from 'rxjs'
import { map, switchMap, toArray, pluck } from 'rxjs/operators'

import { UserModel } from '../../db/user.model'
import { User } from '../../models/user'
import { ObjectId } from 'bson'

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

  public updateById(id: string, data: object) {
    return from(this.userModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean()).pipe(
      map((user: User) => this.filterUserData(user))
    )
  }

  public getAllFriends(id: string) {
    return from(this.userModel.findById(id).populate('friends').lean()).pipe(
      pluck('friends')
    )
  }

  public addUserToFriendList(id: string, candidateId: string) {
    return from(this.userModel.findById(id)).pipe(
      map((data: Document) => data.toObject({ versionKey: false })),
      pluck('friends'),
      switchMap((friends: ObjectId[]) => this.isExistUser(candidateId).pipe(
        map((isUserExist: boolean) => {
          if (!isUserExist) throw new BadRequestException('User with that ID does not exist')
          return friends
        })
      )),
      switchMap((friends: ObjectId[]) => this.isUserExistInFriendList(candidateId, friends).pipe(
        map((isUserExistInFriendList: boolean) => {
          if (isUserExistInFriendList) throw new BadRequestException('User with that ID already exist in friend list')
          return friends
        })
      )),
      map((friends: ObjectId[]) => {
        friends.push(new ObjectId(candidateId))
        return friends
      }),
      switchMap((friends: ObjectId[]) => this.updateById(id, { friends }))
    )
  }

  public deleteUserFromFriendList(id: string, candidateId: string) {
    return from(this.userModel.findById(id)).pipe(
      map((data: Document) => data.toObject({ versionKey: false })),
      pluck('friends'),
      switchMap((friends: ObjectId[]) => this.isExistUser(candidateId).pipe(
        map((isUserExist: boolean) => {
          if (!isUserExist) throw new BadRequestException('User with that ID does not exist')
          return friends
        })
      )),
      switchMap((friends: ObjectId[]) => this.isUserExistInFriendList(candidateId, friends).pipe(
        map((isUserExistInFriendList: boolean) => {
          if (!isUserExistInFriendList) throw new BadRequestException('User with that ID does not exist in friend list')
          return friends
        })
      )),
      map((friends: ObjectId[]) => friends.filter(friend => !friend.equals(candidateId))),
      switchMap((friends: ObjectId[]) => this.updateById(id, { friends }))
    )
  }

  private filterUserData(user: User) {
    const { password, friends, __v, ...filteredUser } = user

    return filteredUser
  }

  private isExistUser(id: string) {
    return from(this.userModel.countDocuments({ _id: id })).pipe(
      map((count: number) =>  count > 0)
    )
  }

  private isUserExistInFriendList(candidateId: ObjectId | string, friendList: ObjectId[]) {
    return of(friendList.some((friendId) => friendId.equals(candidateId)))
  }
}
