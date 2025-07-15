import { Activity } from "./activity";
import { Member } from "./member";

export interface Participation {
  id: number;
  participationDate: string;
  member: Member;
  activity: Activity;
}
