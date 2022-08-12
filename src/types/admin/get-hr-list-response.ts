import { User } from '../../user/user.entity';

export interface SingleHrElement {
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  maxReservedStudents: number | null;
}

export type GetHrListResponse = User[] | null;
