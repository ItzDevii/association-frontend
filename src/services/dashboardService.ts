import api from './axios';

export const getDashboardStats = async () => {
  const res = await api.get('/dashboard/stats');
  return res.data;
};

export const getCotisationStats = async () => {
  const res = await api.get('/dashboard/cotisations');
  return res.data;
};