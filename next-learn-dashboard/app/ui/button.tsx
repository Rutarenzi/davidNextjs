import clsx from 'clsx';

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx('flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white hover:bg-blue-400', className)}>{children}</button>;
}
