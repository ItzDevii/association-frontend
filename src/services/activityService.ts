import axios from 'axios';
import { Activity } from '@/types/activity';

const API_URL = 'http://localhost:8081/api/activities';

export const getAllActivities = async (): Promise<Activity[]> => {
  const response = await axios.get<Activity[]>(API_URL);
  return response.data;
};

export const getActivityById = async (id: number): Promise<Activity> => {
  const response = await axios.get<Activity>(`${API_URL}/${id}`);
  return response.data;
};

export const createActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
  const response = await axios.post<Activity>(API_URL, activity);
  return response.data;
};

export const updateActivity = async (activity: Activity): Promise<Activity> => {
  const response = await axios.put<Activity>(`${API_URL}/${activity.id}`, activity);
  return response.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};