import { User } from './user';

export interface AuditLog {
  id: number;
  action: string;
  timestamp: string;
  user: User;
}