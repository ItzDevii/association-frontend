export interface Member {
  id?: number;
  firstName: string;
  lastName: string;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}