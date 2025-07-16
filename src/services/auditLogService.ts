import axios from 'axios';
import { AuditLog } from '../types/auditlog';

const API_BASE = '/api/audit-logs';

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getAuditLogById = async (id: number): Promise<AuditLog> => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};