import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from 'typegoose'
import { Document } from 'mongoose'
import { compare, hashSync } from 'bcrypt'
import { from, Observable, of } from 'rxjs'
import { catchError, map, pluck, switchMap, toArray, filter } from 'rxjs/operators'

import { User } from '../../db/user'
import { CanCommand, GeoZone, UserDTO, UserRole } from '../../models/user'
import { ObjectId } from 'bson'
import { MongoError } from 'mongodb'
import { getCurrentTime, getRolePriority } from '../../../shared/util'
import { JwtPayload } from '../../../auth/models/auth'

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: ModelType<UserDTO>) {
  }

  public create(user: UserDTO) {
    return of(user).pipe(
      map((user: UserDTO) => ({ ...user, password: hashSync(user.password, 10) })),
      map((user: UserDTO) => new this.userModel(user)),
      switchMap((user) => from(user.save()).pipe(
        map((userDoc: Document) => userDoc.toObject()),
        map((user: UserDTO) => this.filterUserData(user))
      )),
      catchError((error: MongoError) => of(error))
    )
  }

  public getOneById(id: string) {
    return from(this.userModel.findById(id).lean()).pipe(
      map((user: UserDTO) => this.filterUserData(user))
    )
  }

  public getOneByLogin(login: string): Observable<UserDTO> {
    return from(this.userModel.findOne({ login }).lean()).pipe(
      map((user: UserDTO) => this.filterUserData(user))
    )
  }

  public getAll() {
    return from(this.userModel.find().select('-password -friends').lean()).pipe(
      switchMap(users => from(users).pipe(
        map((user: UserDTO) => this.filterUserData(user))
      )),
      toArray()
    )
  }

  public deleteById(id: string) {
    return from(this.userModel.findByIdAndDelete(id))
  }

  public updateById(id: string, data: UserDTO) {
    return from(this.userModel.findByIdAndUpdate(id, { $set: { ...data, updatedAt: getCurrentTime() } }, { new: true }).lean()).pipe(
      map((user: UserDTO) => this.filterUserData(user))
    )
  }

  public getAllFriends(id: string) {
    return from(this.userModel.findById(id)
                    .populate('friends')
                    .select('friends')
                    .lean())
  }

  public addUserToFriendList(id: string, candidateId: string) {
    return from(this.userModel.findById(id)).pipe(
      map((data: Document) => data.toObject({ versionKey: false })),
      pluck('friends'),
      switchMap((friends: ObjectId[]) => this.isExistUser({ _id: candidateId }).pipe(
        map((isUserExist: boolean) => {
          if (!isUserExist) throw new BadRequestException('UserDTO with that ID does not exist')
          return friends
        })
      )),
      switchMap((friends: ObjectId[]) => this.isUserExistInFriendList(candidateId, friends).pipe(
        map((isUserExistInFriendList: boolean) => {
          if (isUserExistInFriendList) throw new BadRequestException('UserDTO with that ID already exist in friend list')
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
      switchMap((friends: ObjectId[]) => this.isExistUser({ _id: candidateId }).pipe(
        map((isUserExist: boolean) => {
          if (!isUserExist) throw new BadRequestException('UserDTO with that ID does not exist')
          return friends
        })
      )),
      switchMap((friends: ObjectId[]) => this.isUserExistInFriendList(candidateId, friends).pipe(
        map((isUserExistInFriendList: boolean) => {
          if (!isUserExistInFriendList) throw new BadRequestException('UserDTO with that ID does not exist in friend list')
          return friends
        })
      )),
      map((friends: ObjectId[]) => friends.filter(friend => !friend.equals(candidateId))),
      switchMap((friends: ObjectId[]) => this.updateById(id, { friends }))
    )
  }

  public isExistUser(criteria: any) {
    return from(this.userModel.countDocuments(criteria)).pipe(
      map((count: number) =>  count > 0)
    )
  }

  public isRoleMatch(userId: string, role: UserRole) {
    return from(this.userModel.findById(userId).select('role'))
  }

  public createGeoZone(userId: string, zone: GeoZone): Observable<GeoZone> {
    return of(zone).pipe(
      map((zone) => ({ _id: new ObjectId(), ...zone })),
      switchMap((zone: GeoZone) => from(this.userModel.findOneAndUpdate(
        { _id: userId },
        { $push: { zones: zone } },
        { new: true }
      ).lean()).pipe(
        map(() => zone)
      ))
    )
  }


  public getAllZones(userId: string) {
    return from(this.userModel.findById(userId).select('zones').lean()).pipe(
      map((zones) => zones.zones)
    )
  }

  public getZoneById(userId: string, zoneId: string) {
    return from(this.userModel.findById(userId).select('zones').lean()).pipe(
      map(data => data.zones),
      switchMap((zones: GeoZone[]) => from(zones).pipe(
        filter((zone) => new ObjectId(zoneId).equals(zone._id))
      ))
    )
  }

  public updateZoneById(userId: string, zoneId: string, zone: GeoZone) {
    return from(this.userModel.findOneAndUpdate(
        { _id: userId, 'zones._id': zoneId },
        { $set: { 'zones.$': zone } },
        { new: true }
      ))
  }

  public comparePasswords(user: UserDTO, password: string) {
    return compare(password, user.password)
  }

  public can(command: CanCommand, requester: JwtPayload | UserDTO, user?: UserDTO) {
    if (command === CanCommand.update) {
      return requester.role === UserRole.admin
    }

    if (command === CanCommand.delete) {
      const reqRole = getRolePriority(requester.role)
      const delRole = getRolePriority(user.role)

      return reqRole > delRole
    }
  }

  private filterUserData(user: UserDTO) {
    const { password, friends, __v, ...filteredUser } = user

    return filteredUser
  }

  private isUserExistInFriendList(candidateId: ObjectId | string, friendList: ObjectId[]) {
    return of(friendList.some((friendId) => friendId.equals(candidateId)))
  }
}
