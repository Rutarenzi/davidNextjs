import { randomUUID } from 'node:crypto';
import { unstable_noStore as noStore } from 'next/cache';
import type {
  CustomerField,
  DashboardStats,
  FormattedCustomersTable,
  Invoice,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  Revenue,
} from './definitions';
import {
  customers,
  invoices as placeholderInvoices,
  revenue,
} from './placeholder-data';
import { formatCurrency } from './utils';

const INVOICES_PER_PAGE = 6;

type DashboardStore = {
  invoices: Invoice[];
};

const runtimeStore = globalThis as typeof globalThis & {
  __dashboardStore?: DashboardStore;
};

const store = (runtimeStore.__dashboardStore ??= {
  invoices: placeholderInvoices.map((invoice) => ({ ...invoice })),
});

export type InvoiceInput = Pick<Invoice, 'customer_id' | 'amount' | 'status'>;

function getInvoiceRows(): InvoicesTable[] {
  return store.invoices
    .map((invoice) => {
      const customer = customers.find(
        (item) => item.id === invoice.customer_id,
      );

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

function getFilteredInvoices(query: string): InvoicesTable[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const rows = getInvoiceRows();

  if (!normalizedQuery) return rows;

  return rows.filter((invoice) =>
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
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );
}

export async function fetchRevenue(): Promise<Revenue[]> {
  noStore();
  return revenue.map((month) => ({ ...month }));
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  noStore();
  return getInvoiceRows()
    .slice(0, 5)
    .map(({ id, name, image_url, email, amount }) => ({
      id,
      name,
      image_url,
      email,
      amount: formatCurrency(amount),
    }));
}

export async function fetchCardData() {
  noStore();
  const paidAmount = store.invoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((total, invoice) => total + invoice.amount, 0);
  const pendingAmount = store.invoices
    .filter((invoice) => invoice.status === 'pending')
    .reduce((total, invoice) => total + invoice.amount, 0);

  return {
    numberOfCustomers: customers.length,
    numberOfInvoices: store.invoices.length,
    totalPaidInvoices: formatCurrency(paidAmount),
    totalPendingInvoices: formatCurrency(pendingAmount),
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  noStore();
  return {
    totalCustomers: customers.length,
    totalInvoices: store.invoices.length,
    totalPaidInvoices: store.invoices.filter(
      (invoice) => invoice.status === 'paid',
    ).length,
    totalPendingInvoices: store.invoices.filter(
      (invoice) => invoice.status === 'pending',
    ).length,
    totalRevenue: revenue.reduce((total, month) => total + month.revenue, 0),
  };
}

export async function fetchInvoices(): Promise<InvoicesTable[]> {
  noStore();
  return getInvoiceRows();
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  return (await fetchInvoicePage(query, currentPage)).data;
}

export async function fetchInvoicePage(
  query: string,
  currentPage: number,
  pageSize = INVOICES_PER_PAGE,
): Promise<{
  data: InvoicesTable[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> {
  noStore();
  const invoices = getFilteredInvoices(query);
  const limit =
    Number.isSafeInteger(pageSize) && pageSize > 0
      ? pageSize
      : INVOICES_PER_PAGE;
  const totalPages = Math.ceil(invoices.length / limit);
  const requestedPage =
    Number.isSafeInteger(currentPage) && currentPage > 0 ? currentPage : 1;
  const page = Math.min(requestedPage, Math.max(1, totalPages));
  const startIndex = (page - 1) * limit;

  return {
    data: invoices.slice(startIndex, startIndex + limit),
    page,
    limit,
    total: invoices.length,
    totalPages,
  };
}

export async function fetchInvoicesPages(query: string): Promise<number> {
  noStore();
  return Math.ceil(getFilteredInvoices(query).length / INVOICES_PER_PAGE);
}

export async function fetchCustomers(): Promise<CustomerField[]> {
  noStore();
  return customers.map(({ id, name }) => ({ id, name }));
}

export async function fetchInvoiceById(
  id: string,
): Promise<InvoiceForm | undefined> {
  noStore();
  const invoice = store.invoices.find((item) => item.id === id);

  if (!invoice) return undefined;

  return {
    id: invoice.id,
    customer_id: invoice.customer_id,
    amount: invoice.amount,
    status: invoice.status,
  };
}

export async function fetchCustomersTable(): Promise<
  FormattedCustomersTable[]
> {
  noStore();
  return customers.map((customer): FormattedCustomersTable => {
    const customerInvoices = store.invoices.filter(
      (invoice) => invoice.customer_id === customer.id,
    );
    const pendingAmount = customerInvoices
      .filter((invoice) => invoice.status === 'pending')
      .reduce((total, invoice) => total + invoice.amount, 0);
    const paidAmount = customerInvoices
      .filter((invoice) => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.amount, 0);

    return {
      ...customer,
      total_invoices: customerInvoices.length,
      total_pending: formatCurrency(pendingAmount),
      total_paid: formatCurrency(paidAmount),
    };
  });
}

export function createInvoiceRecord(input: InvoiceInput): boolean {
  if (!customers.some((customer) => customer.id === input.customer_id)) {
    return false;
  }

  store.invoices.unshift({
    ...input,
    id: randomUUID(),
    date: new Date().toISOString().slice(0, 10),
  });

  return true;
}

export function updateInvoiceRecord(id: string, input: InvoiceInput): boolean {
  const invoice = store.invoices.find((item) => item.id === id);

  if (
    !invoice ||
    !customers.some((customer) => customer.id === input.customer_id)
  ) {
    return false;
  }

  Object.assign(invoice, input);
  return true;
}

export function deleteInvoiceRecord(id: string): boolean {
  const index = store.invoices.findIndex((invoice) => invoice.id === id);
  if (index < 0) return false;

  store.invoices.splice(index, 1);
  return true;
}

export function resetInvoiceRecords(): void {
  store.invoices = placeholderInvoices.map((invoice) => ({ ...invoice }));
}
