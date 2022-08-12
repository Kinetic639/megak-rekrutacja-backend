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
import { extractJwtFromQuery } from './extract-jwt-from-req-param';

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(
  Strategy,
  'reset',
) {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromQuery]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: {
    email: string;
    id: string;
    token: string;
    iat: number;
    exp: number;
  }) {
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user.active) {
      throw new HttpException(
        'Twoje konto nie jest jeszcze aktywne',
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }
}
