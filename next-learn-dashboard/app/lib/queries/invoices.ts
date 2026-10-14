import type { Invoice, InvoicesTable, LatestInvoice } from '../definitions';
import { customers, invoices as invoiceRecords } from '../placeholder-data';
import { formatCurrency } from '../utils';

export async function getInvoices(): Promise<Invoice[]> {
  return invoiceRecords.map((invoice) => ({ ...invoice }));
}

export async function getInvoiceRows(): Promise<InvoicesTable[]> {
  return invoiceRecords
    .map((invoice) => {
      const customer = customers.find((item) => item.id === invoice.customer_id);

      return customer
        ? {
            ...invoice,
            name: customer.name,
            email: customer.email,
            image_url: customer.image_url,
          }
        : null;
    })
    .filter((invoice): invoice is InvoicesTable => invoice !== null)
    .sort((first, second) => second.date.localeCompare(first.date));
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
  const normalizedQuery = query.trim().toLowerCase();
  const rows = await getInvoiceRows();
  const filteredRows = normalizedQuery
    ? rows.filter((invoice) =>
        [
          invoice.id,
          invoice.name,
          invoice.email,
          invoice.amount,
          invoice.amount / 100,
          formatCurrency(invoice.amount),
          invoice.date,
          invoice.status,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : rows;

  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / safeLimit));
  const boundedPage = Math.min(safePage, totalPages);
  const startIndex = (boundedPage - 1) * safeLimit;

  return {
    data: filteredRows.slice(startIndex, startIndex + safeLimit),
    page: boundedPage,
    limit: safeLimit,
    total: filteredRows.length,
    totalPages,
  };
}

export async function getLatestInvoices(): Promise<LatestInvoice[]> {
  const rows = await getInvoiceRows();

  return rows.slice(0, 5).map(({ id, name, image_url, email, amount }) => ({
    id,
    name,
    image_url,
    email,
    amount: formatCurrency(amount),
  }));
}
