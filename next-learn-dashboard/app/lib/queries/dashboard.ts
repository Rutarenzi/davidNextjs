import { fetchDashboardStats, fetchRevenue } from '../data';
import type { DashboardStats, Revenue } from '../definitions';

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchDashboardStats();
}

export async function getRevenue(): Promise<Revenue[]> {
  return fetchRevenue();
}
