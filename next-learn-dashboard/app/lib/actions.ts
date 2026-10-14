'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {
  createInvoiceRecord,
  deleteInvoiceRecord,
  updateInvoiceRecord,
} from './data';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string().min(1, 'Please select a customer.'),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

async function requireAuthenticatedUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be signed in to change invoices.');
  }
}

export async function createInvoice(prevState: State | undefined, formData: FormData) {
  await requireAuthenticatedUser();
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  if (
    !createInvoiceRecord({
      customer_id: customerId,
      amount: Math.round(amount * 100),
      status,
    })
  ) {
    return { message: 'Please select a valid customer.' };
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State | undefined,
  formData: FormData,
) {
  await requireAuthenticatedUser();
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  if (
    !updateInvoiceRecord(id, {
      customer_id: customerId,
      amount: Math.round(amount * 100),
      status,
    })
  ) {
    return { message: 'Invoice or customer could not be found.' };
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await requireAuthenticatedUser();
  if (!deleteInvoiceRecord(id)) return;

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
