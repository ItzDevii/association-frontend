import { Member } from './member';

export interface Cotisation {
  id: number;
  amount: number;
  date: string;
  member: Member;
}