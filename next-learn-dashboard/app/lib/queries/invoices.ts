import type { Invoice, InvoicesTable, LatestInvoice } from '../definitions';
import {
  fetchFilteredInvoices,
  fetchInvoicePage,
  fetchInvoices,
  fetchLatestInvoices,
} from '../data';

export async function getInvoices(): Promise<Invoice[]> {
  const rows = await fetchInvoices();
  return rows.map(({ id, customer_id, amount, date, status }) => ({
    id,
    customer_id,
    amount,
    date,
    status,
  }));
}

export async function getInvoiceRows(): Promise<InvoicesTable[]> {
  return fetchInvoices();
}

export async function getFilteredInvoices({
  query = '',
  page = 1,
  limit = 10,
}: {
  query?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  data: InvoicesTable[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  return fetchInvoicePage(query, page, limit);
}

export async function getLatestInvoices(): Promise<LatestInvoice[]> {
  return fetchLatestInvoices();
}
