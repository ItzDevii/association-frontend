import { Member } from './member';

export interface Document {
  id: number;
  name: string;
  url: string;
  member: Member;
}