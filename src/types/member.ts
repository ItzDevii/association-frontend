import { User } from './User';

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  joinDate: string; // ISO Date
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  user: User;
}