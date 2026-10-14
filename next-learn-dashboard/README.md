# Next.js Dashboard

This is a Next.js 14 App Router dashboard using typed local sample data. It does
not require a database or database credentials.

## Start the App

If you opened the parent `davidNextjs` workspace, first enter the app folder:

```powershell
cd .\next-learn-dashboard
```

Install packages and prepare the local environment file:

```powershell
pnpm install
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Set `AUTH_SECRET` in `.env.local` to a random value, then start the development
server:

```powershell
pnpm dev
```

Open the `Local` URL printed by Next.js, normally <http://localhost:3000>. If
that port is already in use, Next.js selects another available port and prints
its URL. Keep the terminal running while using the app; press `Ctrl+C` there to
stop the server.

## Sign In

Open `/` and select **Login**, or visit `/login` directly. In development, use
any valid email address and a password with at least six characters. This is a
development-only mock sign-in; it does not check or store passwords. Signed-out
visits to dashboard routes redirect to the login page.

Production sign-in is intentionally disabled until a real identity provider and
persistent user store are configured. Do not deploy the mock login as real
authentication.

## Navigate the Dashboard

The dashboard sidebar links to these sections:

| Page      | Route                  | What it contains                                                         |
| --------- | ---------------------- | ------------------------------------------------------------------------ |
| Home      | `/dashboard`           | Summary cards, revenue chart, and latest invoices                        |
| Invoices  | `/dashboard/invoices`  | Searchable, paginated invoice list with create, edit, and delete actions |
| Customers | `/dashboard/customers` | Customer totals derived from the local invoices                          |

Invoice forms are available at `/dashboard/invoices/create` and
`/dashboard/invoices/[id]/edit`. The root route `/` is a landing page; its Login
link enters the protected dashboard flow.

## Project Layout

- `app/dashboard/` contains the dashboard, customer, and invoice routes.
- `app/ui/` contains the reusable page, navigation, form, and table components.
- `app/lib/placeholder-data.ts` contains typed sample customers, invoices, and revenue.
- `app/lib/data.ts` provides shared reads, filtering, pagination, summaries, and in-memory invoice mutations.
- `app/lib/actions.ts` validates and handles invoice form submissions.
- `auth.ts`, `auth.config.ts`, and `middleware.ts` implement the development login and protect dashboard routes.

## Data and Persistence

Invoice changes are kept in an in-memory server store. They are visible during
the current server process, but can be lost after a restart and are not shared
between multiple server instances. The original placeholder data is restored
when the store is initialized again. No passwords or credentials are included
in the sample data.

## Project Commands

Run these from `next-learn-dashboard`:

```powershell
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

`pnpm start` serves the production build, so run `pnpm build` first. The current
production authentication intentionally rejects the development mock login.
