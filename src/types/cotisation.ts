import { Member } from './member';

export interface Cotisation {
  id: number;
  amount: number;
  paymentDate: string;
  member: Member;
}