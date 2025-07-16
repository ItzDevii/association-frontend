import { Member } from './member';

export interface Cotisation {
  id: number;
  amount: number;
  paymentDate: string;
  member: Member;
}

export interface CotisationRequest {
  amount: number;
  paymentDate: string;
  memberId: number;
}