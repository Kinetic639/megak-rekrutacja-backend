import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { User } from '../user/user.entity';
import { LoginResponse, LogoutResponse } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return { token: null, message: 'Incorrect email' };
    }
    if (user.password !== password) {
      //todo add becrypt compare to check password
      return { token: null, message: 'Incorrect password' };
    }
    if (!user.active) {
      return { token: null, message: 'Account is not active' };
    }
    const { password: _pass, ...result } = user;
    return result;
  }

  async login(user: User, response: Response): Promise<LoginResponse> {
    const payload = { email: user.email, id: user.id, role: user.userType };

    const token = this.jwtService.sign(payload);
    console.log(token);

    response.cookie('auth', token, { signed: true });
    return { message: 'Login successful', user, statusCode: 200 };
  }

  logout(res: Response): LogoutResponse {
    res.clearCookie('auth');
    return {
      statusCode: 200,
      message: 'Logout successful',
    };
  }
}
