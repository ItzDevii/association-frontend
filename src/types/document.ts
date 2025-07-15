import { Member } from './member';

export interface Document {
  id: number;
  title: string;
  type: string;
  uploadDate: string;
  member: Member;
}