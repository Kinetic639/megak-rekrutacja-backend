import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ActivateAuthGuard extends AuthGuard('activate') {}
