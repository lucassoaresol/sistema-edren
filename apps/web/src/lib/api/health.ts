import { type ApiResponse, request } from './request';

export type DatabaseHealth = {
  ok: boolean;
  database: 'reachable';
  seed: {
    profiles: number;
    collections: number;
  };
};

export function getDatabaseHealth() {
  return request<DatabaseHealth>('/api/health/db');
}
