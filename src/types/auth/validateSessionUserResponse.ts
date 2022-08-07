import { User } from '../../user/user.entity';

export type ValidateSessionUserResponse = {
  user: User | null;
  status: number;
};
