import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport-strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStudentStrategy } from './passport-strategy/jwt.student.strategy';
import { StudentAuthGuard } from './auth-guards/student-auth.guard';
import { LocalAuthGuard } from './auth-guards/local-auth.guard';
import { HrAuthGuard } from './auth-guards/hr-auth.guard';
import { AdminAuthGuard } from './auth-guards/admin-auth.guard';
import { JwtAdminStrategy } from './passport-strategy/jwt.admin.strategy';
import { JwtHrStrategy } from './passport-strategy/jwt.hr.strategy';
import { JWT_SECRET } from '../config/secrets';
import { ActivateAuthGuard } from './auth-guards/activate.guard';
import { JwtActivateAccountStrategy } from './passport-strategy/activate.strategy';
import { UserAuthGuard } from './auth-guards/user-auth.guard';
import { JwtUserStrategy } from './passport-strategy/jwt.user.strategy';
import { MailModule } from '../mail/mail.module';
import { ResetPasswordAuthGuard } from './auth-guards/reset-password.guard';
import { JwtResetPasswordStrategy } from './passport-strategy/reset-password.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => MailModule),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: 1000 * 60,
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStudentStrategy,
    JwtAdminStrategy,
    JwtHrStrategy,
    LocalAuthGuard,
    StudentAuthGuard,
    AdminAuthGuard,
    HrAuthGuard,
    ActivateAuthGuard,
    JwtActivateAccountStrategy,
    UserAuthGuard,
    JwtUserStrategy,
    ResetPasswordAuthGuard,
    JwtResetPasswordStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
