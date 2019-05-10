/*
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthorService } from '../../../author/services/author/author.service'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private authorS: AuthorService) {}

  public async validateAuthor(nick: string) {
    return await this.authorS.getByNick(nick)
  }
}
*/
