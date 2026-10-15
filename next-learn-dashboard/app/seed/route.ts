import { NextResponse } from 'next/server';
import {
  customers,
  dashboardStats,
  invoices,
  revenue,
  users,
} from '@/app/lib/placeholder-data';
import { resetInvoiceRecords } from '@/app/lib/data';

function getSummary() {
  return {
    users: users.length,
    customers: customers.length,
    invoices: invoices.length,
    revenueMonths: revenue.length,
    totalRevenue: dashboardStats.totalRevenue,
  };
}

function developmentOnlyResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: 'The seed route is available only in development mode.',
    },
    { status: 403 },
  );
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return developmentOnlyResponse();
  }

  return NextResponse.json({
    ok: true,
    message:
      'Development fixture summary. Send POST to reset invoices in this server process.',
    environment: 'development',
    summary: getSummary(),
  });
}

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return developmentOnlyResponse();
  }

  resetInvoiceRecords();
  return NextResponse.json({
    ok: true,
    message:
      'Invoice data reset to placeholder records for this server process only.',
    environment: 'development',
    summary: getSummary(),
  });
}
