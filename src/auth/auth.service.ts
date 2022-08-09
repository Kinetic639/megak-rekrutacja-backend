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

interface ValidPass {
  message: string;
  statusCode: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  private validatePassword(password: string): ValidPass {
    if (password.length < 7) {
      return {
        message: 'Hasło musi zawierać co najmniej 8 znaków',
        statusCode: 404,
      };
    }

    if (!/(?=.[A-Z])/.test(password)) {
      return {
        message: 'Hasło musi zawierać conajmniej jedną dużą litere',
        statusCode: 404,
      };
    }

    if (!/(?=.[a-z])/.test(password)) {
      return {
        message: 'Hasło musi zawierać conajmniej jedną małą litere',
        statusCode: 404,
      };
    }

    if (!/(?=.*[@#$%^&+=!_~])/.test(password)) {
      return {
        message: 'Hasło musi zawierać conajmniej jeden znak specjalny',
        statusCode: 404,
      };
    }

    if (!/(?=.*[0-9])/.test(password)) {
      return {
        message: 'Hasło musi zawierać conajmniej jedną liczbe',
        statusCode: 404,
      };
    }

    return {
      message: 'Hasło poprawne',
      statusCode: 200,
    };
  }

  generateToken(user) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.userType,
      token: user.token,
    };

    return this.jwtService.sign(payload, { expiresIn: '10h' });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return { auth: null, message: 'Niepoprawny e-mail' };
    }

    if (!(await compare(password, user.password))) {
      return { auth: null, message: 'Niepoprawne hasło' };
    }
    if (!user.active) {
      return { auth: null, message: 'Konto nieaktywne' };
    }
    const { password: _pass, ...result } = user;
    return result;
  }

  async login(user: User, response: Response): Promise<LoginResponse> {
    const token = this.generateToken(user);
    response.cookie('auth', token, {
      signed: true,
      httpOnly: true,
    });
    response.cookie('user', user, {
      signed: true,
      httpOnly: true,
    });
    return { message: 'Zalogowano', user, statusCode: 200 };
  }

  validateSessionUser(user: User): ValidateSessionUserResponse {
    return { user, status: 200 };
  }

  logout(response: Response) {
    response.clearCookie('auth');
    response.clearCookie('user');
    return {
      statusCode: 200,
      message: 'Wylogowano',
    };
  }

  async activate(user: User, data: Activate): Promise<ActivateResponse> {
    if (
      !data.password ||
      !data.rePassword ||
      data.password !== data.rePassword
    ) {
      return {
        message: 'Musisz uzupełnić i powtórzyć hasło i muszą być takie same',
        statusCode: 404,
      };
    }

    const validatePass: ValidPass = this.validatePassword(data.password);

    if (validatePass.statusCode !== 200) {
      return validatePass;
    }

    user.password = await hash(data.password, 10);
    user.active = true;
    user.token = null;
    await user.save();

    return {
      statusCode: 202,
      message: 'Konto aktywowane poprawnie',
    };
  }
}
