// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  image_url?: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type DashboardStats = {
  totalCustomers: number;
  totalInvoices: number;
  totalPaidInvoices: number;
  totalPendingInvoices: number;
  totalRevenue: number;
};

export type CustomerField = Pick<Customer, 'id' | 'name'>;

export type InvoiceForm = Pick<
  Invoice,
  'id' | 'customer_id' | 'amount' | 'status'
>;

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type InvoicesTable = Invoice &
  Pick<Customer, 'name' | 'email' | 'image_url'>;

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};
