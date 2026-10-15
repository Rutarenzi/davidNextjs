import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';
 
export default function Form({
  customers,
}: {
  customers: CustomerField[];
}) {
  return <form action={createInvoice.bind(null, undefined)} className="rounded-lg bg-gray-50 p-4 md:p-6"><label className="mb-2 block text-sm font-medium" htmlFor="customer">Choose customer</label><select id="customer" name="customerId" className="mb-4 block w-full rounded-md border p-2" defaultValue=""><option value="" disabled>Select a customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select><label className="mb-2 block text-sm font-medium" htmlFor="amount">Amount</label><input id="amount" name="amount" type="number" step="0.01" placeholder="Enter USD amount" className="mb-4 block w-full rounded-md border p-2" required /><fieldset className="mb-4"><legend className="mb-2 text-sm font-medium">Status</legend><label className="mr-4"><input type="radio" name="status" value="pending" defaultChecked /> Pending</label><label><input type="radio" name="status" value="paid" /> Paid</label></fieldset><div className="flex justify-end gap-4"><Link href="/dashboard/invoices" className="rounded-md border px-4 py-2">Cancel</Link><Button type="submit">Create Invoice</Button></div></form>;
}