import type { Customer } from '../definitions';
import { customers } from '../placeholder-data';

export async function getCustomers(): Promise<Customer[]> {
  return customers.map((customer) => ({ ...customer }));
}
