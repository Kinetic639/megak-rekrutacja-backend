import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JWT_SECRET } from 'src/config/secrets';
import { UserService } from '../../user/user.service';
import { UserType } from '../../types';
import { extractJwtFromCookie } from './extract-jwt-from-cookie';

@Injectable()
export class JwtHrStrategy extends PassportStrategy(Strategy, 'hr') {
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
    if (!(user.userType === UserType.HR || user.userType === UserType.ADMIN)) {
      throw new HttpException('Incorrect user roles ', HttpStatus.FORBIDDEN);
    }
    return { ...payload };
  }
}
