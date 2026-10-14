import { dashboardStats, revenue } from '../placeholder-data';
import type { DashboardStats, Revenue } from '../definitions';

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    ...dashboardStats,
  };
}

export async function getRevenue(): Promise<Revenue[]> {
  return revenue.map((item) => ({ ...item }));
}
