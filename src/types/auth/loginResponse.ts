import { User } from '../../user/user.entity';

export interface LoginResponse {
  message: string;
  statusCode: number;
  user: User;
}
