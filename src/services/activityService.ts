import api from './axios';
import { Activity } from '@/types/activity';

export const getActivities = async (): Promise<Activity[]> => {
  const res = await api.get('/activities');
  return res.data;
};

export const createActivity = async (data: Omit<Activity, 'id'>): Promise<Activity> => {
  const res = await api.post('/activities', data);
  return res.data;
};

export const updateActivity = async (activity: Activity): Promise<Activity> => {
  const res = await api.put(`/activities/${activity.id}`, activity);
  return res.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  await api.delete(`/activities/${id}`);
};