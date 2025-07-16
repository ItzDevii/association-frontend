import { Member } from './member';
import { Activity } from './activity';

export interface Participation {
  id: number;
  signupDate: string;
  member: Member;
  activity: Activity;
}