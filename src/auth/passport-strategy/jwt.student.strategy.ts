import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { UserService } from '../../user/user.service';

import { JWT_SECRET } from '../../config/secrets';
import { UserType } from '../../types';
import { extractJwtFromCookie } from './extract-jwt-from-cookie';

@Injectable()
export class JwtStudentStrategy extends PassportStrategy(Strategy, 'student') {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: {
    email: string;
    id: string;
    iat: number;
    exp: number;
  }) {
    const user = await this.userService.findUserByEmail(payload.email);
    if (
      !(user.userType === UserType.STUDENT || user.userType === UserType.ADMIN)
    ) {
      throw new HttpException('Brak dostępu do zasobów', HttpStatus.FORBIDDEN);
    }
    const { password, token, ...rest } = user;
    return rest;
  }
}
