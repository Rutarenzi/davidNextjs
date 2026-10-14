import { randomUUID } from 'node:crypto';
import { unstable_noStore as noStore } from 'next/cache';
import type {
  CustomerField,
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

export async function fetchInvoices(): Promise<InvoicesTable[]> {
  noStore();
  return getInvoiceRows();
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  noStore();
  const invoices = getFilteredInvoices(query);
  const lastPage = Math.max(1, Math.ceil(invoices.length / INVOICES_PER_PAGE));
  const page = Math.min(Math.max(1, currentPage), lastPage);
  const startIndex = (page - 1) * INVOICES_PER_PAGE;

  return invoices.slice(startIndex, startIndex + INVOICES_PER_PAGE);
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

export async function fetchCustomersTable(): Promise<FormattedCustomersTable[]> {
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

export function updateInvoiceRecord(
  id: string,
  input: InvoiceInput,
): boolean {
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
