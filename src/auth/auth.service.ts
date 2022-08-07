import { forwardRef, Inject, Injectable, Req } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { User } from '../user/user.entity';
import {
  LoginResponse,
  LogoutResponse,
  ValidateSessionUserResponse,
} from '../types';
import { Activate } from './dto/activate.dto';
import { ActivateResponse } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  generateToken(user) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.userType,
      token: user.token,
    };

    return this.jwtService.sign(payload, { expiresIn: '30s' });
  }

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
    const token = this.generateToken(user);
    response.cookie('auth', token, {
      signed: true,
    });
    response.cookie('user', user, {
      signed: true,
    });
    return { message: 'Login successful', user, statusCode: 200 };
  }

  validateSessionUser(user: User): ValidateSessionUserResponse {
    return { user, status: 200 };
  }

  logout(response: Response) {
    response.clearCookie('auth');
    response.clearCookie('user');
    return {
      statusCode: 200,
      message: 'Logout successful',
    };
  }

  // async activate(token: string) {}
  async activate(user: User, data: Activate): Promise<ActivateResponse> {
    user.password = await hash(data.password, 10);
    user.active = true;
    user.token = null;
    await user.save();

    return {
      statusCode: 202,
      message: 'Account active successfully',
    };
  }
}
