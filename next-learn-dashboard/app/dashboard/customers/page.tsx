import { fetchCustomersTable } from '@/app/lib/data';
import CustomersTable from '@/app/ui/customers/table';

export default async function Page() {
  const customers = await fetchCustomersTable();
  return <CustomersTable customers={customers} />;
}