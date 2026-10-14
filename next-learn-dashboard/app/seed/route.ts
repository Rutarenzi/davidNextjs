import { NextResponse } from 'next/server';
import { customers, dashboardStats, invoices, revenue, users } from '@/app/lib/placeholder-data';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      {
        ok: false,
        error: 'The seed route is available only in development mode.',
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: 'Demo data restored to the default in-memory seed set.',
    environment: 'development',
    summary: {
      users: users.length,
      customers: customers.length,
      invoices: invoices.length,
      revenueMonths: revenue.length,
      totalRevenue: dashboardStats.totalRevenue,
    },
  });
}

export async function POST() {
  return GET();
}
