import { fetchFilteredInvoices, fetchInvoicesPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import InvoicesTable from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { redirect } from 'next/navigation';

type PageProps = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const query = searchParams?.query ?? '';
  const requestedPage = Number(searchParams?.page);
  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const [invoices, totalPages] = await Promise.all([
    fetchFilteredInvoices(query, currentPage),
    fetchInvoicesPages(query),
  ]);
  const boundedPage = Math.min(currentPage, Math.max(1, totalPages));

  if (searchParams?.page && searchParams.page !== String(boundedPage)) {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    params.set('page', String(boundedPage));
    redirect(`/dashboard/invoices?${params.toString()}`);
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Invoices
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <InvoicesTable invoices={invoices} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
