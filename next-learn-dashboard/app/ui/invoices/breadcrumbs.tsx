import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: { label: string; href: string; active?: boolean }[] }) {
  return <nav aria-label="Breadcrumb" className="mb-6 block"><ol className="flex text-xl md:text-2xl">{breadcrumbs.map((breadcrumb, index) => <li key={breadcrumb.href} className={`${breadcrumb.active ? 'text-gray-900' : 'text-gray-500'}`}>{index > 0 && <ChevronRightIcon className="mx-3 inline-block h-5 w-5" />}{breadcrumb.active ? breadcrumb.label : <Link href={breadcrumb.href as Route} className="hover:text-blue-600">{index === 0 ? <><HomeIcon className="mr-1 inline-block h-5 w-5" />{breadcrumb.label}</> : breadcrumb.label}</Link>}</li>)}</ol></nav>;
}
