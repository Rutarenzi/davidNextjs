import { fetchFilteredInvoices, fetchInvoicesPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import InvoicesTable from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';

type PageProps = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;
  const [invoices, totalPages] = await Promise.all([
    fetchFilteredInvoices(query, currentPage),
    fetchInvoicesPages(query),
  ]);

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