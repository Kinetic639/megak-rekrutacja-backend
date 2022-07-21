import { Injectable } from '@nestjs/common';
import { AuthLoginDto, RegisterAuthResponse } from './dto/auth-login.dto';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { User } from './auth.entity';
import { hashPwd } from '../utils/hash-pwd';

@Injectable()
export class AuthService {
  private createToken(createTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payLoad: JwtPayload = { id: createTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(
      payLoad,
      'nextekeyjioj*(HJ$!)$H!)$H)!$%!&)(*#@IJKNM!QASXCVNM<>LKJHGFDSAQWERTYUIOP{+_)(*&^%$#@!!!!QWERTYUIO)_{::::><M?ukryć',
      { expiresIn },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await User.findOneBy({ currentTokenId: token });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOneBy({
        email: req.email,
        pwdHash: hashPwd(req.pwd),
      });
      if (!user) {
        return res.json({ message: 'Invalid login data' });
      }
      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          secure: false, //tu ustawiamy true jeśli jest https (czyli na produkcji)
          domain: 'localhost', //tu domenę
          httpOnly: true, //dzięki temu front nie widzi ciastek jwt
          sameSite: 'lax',
        })
        .json({ message: 'Success' });
    } catch (e) {
      return res.json({ message: e.message });
    }
  }

  filter(user: User): RegisterAuthResponse {
    const { email, id } = user;
    return { id, email };
  }

  async register(newU): Promise<RegisterAuthResponse> {
    const user = new User();
    user.email = newU.email;
    user.pwdHash = hashPwd(newU.pwd);
    await user.save();
    return this.filter(user);
  }

  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('jwt', {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      });
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
