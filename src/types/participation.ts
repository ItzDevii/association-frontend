export interface Participation {
  id?: number;
  memberId: number;
  activityId: number;
  signupDate: string;

  member?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  activity?: {
    id: number;
    name: string;
  };
}
