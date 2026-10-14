import { updateInvoice } from '@/app/lib/actions';
import { InvoiceForm, CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id, undefined);
  return <form action={updateInvoiceWithId} className="rounded-lg bg-gray-50 p-4 md:p-6"><label className="mb-2 block text-sm font-medium" htmlFor="customer">Choose customer</label><select id="customer" name="customerId" defaultValue={invoice.customer_id} className="mb-4 block w-full rounded-md border p-2">{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select><label className="mb-2 block text-sm font-medium" htmlFor="amount">Amount</label><input id="amount" name="amount" type="number" step="0.01" defaultValue={invoice.amount / 100} className="mb-4 block w-full rounded-md border p-2" required /><fieldset className="mb-4"><legend className="mb-2 text-sm font-medium">Status</legend><label className="mr-4"><input type="radio" name="status" value="pending" defaultChecked={invoice.status === 'pending'} /> Pending</label><label><input type="radio" name="status" value="paid" defaultChecked={invoice.status === 'paid'} /> Paid</label></fieldset><div className="flex justify-end gap-4"><Link href="/dashboard/invoices" className="rounded-md border px-4 py-2">Cancel</Link><Button type="submit">Edit Invoice</Button></div></form>;
}