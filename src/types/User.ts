export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'MEMBER';
}