export interface AuditLog {
  id: number;
  action: string;
  timestamp: string;
  performedBy: string;
}
