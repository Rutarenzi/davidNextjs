import { NextResponse } from 'next/server';
import {
  getCustomers,
  getDashboardStats,
  getFilteredInvoices,
  getRevenue,
  getUsers,
} from '@/app/lib/queries';

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) return fallback;
  const normalized = Number.parseInt(value, 10);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entity = (searchParams.get('entity') ?? 'dashboard').toLowerCase();
  const page = parsePositiveInteger(searchParams.get('page'), 1);
  const limit = parsePositiveInteger(searchParams.get('limit'), 10);
  const search = searchParams.get('search') ?? '';

  try {
    switch (entity) {
      case 'users': {
        const users = await getUsers();
        return NextResponse.json({
          entity,
          data: users.map(({ id, name, email, role }) => ({ id, name, email, role })),
          page,
          limit,
          total: users.length,
        });
      }
      case 'customers': {
        const customers = await getCustomers();
        return NextResponse.json({
          entity,
          data: customers,
          page,
          limit,
          total: customers.length,
        });
      }
      case 'invoices': {
        const result = await getFilteredInvoices({ query: search, page, limit });
        return NextResponse.json({
          entity,
          data: result.data,
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        });
      }
      case 'dashboard': {
        const stats = await getDashboardStats();
        return NextResponse.json({
          entity,
          data: stats,
          page,
          limit,
        });
      }
      case 'revenue': {
        const revenue = await getRevenue();
        return NextResponse.json({
          entity,
          data: revenue,
          page,
          limit,
          total: revenue.length,
        });
      }
      default:
        return NextResponse.json(
          {
            error: `Unsupported entity: ${entity}. Supported values are users, customers, invoices, dashboard, and revenue.`,
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Query route failed:', error);
    return NextResponse.json(
      {
        error: 'The demo query could not be completed.',
      },
      { status: 500 },
    );
  }
}
