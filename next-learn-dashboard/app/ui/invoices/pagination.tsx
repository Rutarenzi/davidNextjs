'use client';
 
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import type { Route } from 'next';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
 
export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}` as Route;
  };

  const allPages = generatePagination(currentPage, totalPages);
  return <div className="inline-flex"><button aria-label="Previous page" disabled={currentPage <= 1} className="rounded-md border px-3 py-2 disabled:opacity-50" onClick={() => window.location.href = createPageURL(currentPage - 1)}><ArrowLeftIcon className="h-5 w-5" /></button>{allPages.map((page, index) => page === '...' ? <span key={`${page}-${index}`} className="px-3 py-2">...</span> : <Link key={page} href={createPageURL(page)} className={clsx('rounded-md px-3 py-2', { 'bg-blue-600 text-white': currentPage === page })}>{page}</Link>)}<button aria-label="Next page" disabled={currentPage >= totalPages} className="rounded-md border px-3 py-2 disabled:opacity-50" onClick={() => window.location.href = createPageURL(currentPage + 1)}><ArrowRightIcon className="h-5 w-5" /></button></div>;

}