import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BreadcrumbItem, PageProps } from '@/types'; // optional - if you have shared types
import moment from 'moment';
import barangay from '@/routes/barangay';
import appLayout from '@/layouts/barangay/app-layout';
import AppLayout from '@/layouts/barangay/app-layout';

type ReportItem = {
  id: string;
  drop_site_id: number;
  description: string;
  status: string;
  created_at: string;
  user?: { id?: number; name?: string; email?: string };
  drop_site?: { id?: number; name?: string; latitude?: number; longitude?: number };
};

type ReportsPayload = {
  data: ReportItem[];
  meta: any;
  links: any[];
};

interface Props {
  reports: ReportsPayload;
  filters: { status?: string | null; from?: string | null; to?: string | null };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resident Reports',
        href: barangay.reports.index.url()
    }
];

export default function Index({ reports, filters }: Props) {
  const [status, setStatus] = useState(filters.status ?? '');
  const [from, setFrom] = useState(filters.from ?? '');
  const [to, setTo] = useState(filters.to ?? '');

  function applyFilters() {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (from) params.from = from;
    if (to) params.to = to;

      router.get(barangay.reports.index().url, params, { preserveState: true, replace: true });
  }

  function clearFilters() {
    setStatus('');
    setFrom('');
    setTo('');
      router.get(barangay.reports.index().url, {}, { preserveState: true, replace: true });
  }

  return (
      <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Drop Site Reports" />
          <main className="p-2">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Drop Site Reports</h1>

        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="px-3 py-1 border rounded text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded shadow-sm mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="ml-auto">
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow-sm">
        <table className="min-w-full">
          <thead className="">
            <tr>
              <th className="text-left p-3 text-sm">ID</th>
              <th className="text-left p-3 text-sm">Reporter</th>
              <th className="text-left p-3 text-sm">Drop Site</th>
              <th className="text-left p-3 text-sm">Description</th>
              <th className="text-left p-3 text-sm">Status</th>
              <th className="text-left p-3 text-sm">Created</th>
              <th className="p-3 text-sm"></th>
            </tr>
          </thead>

          <tbody>
            {reports.data.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-sm text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}

            {reports.data.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 text-sm">{r.id}</td>
                <td className="p-3 text-sm">{r.user?.name ?? '—'}</td>
                <td className="p-3 text-sm">{r.drop_site?.name ?? r.drop_site_id}</td>
                <td className="p-3 text-sm max-w-xs truncate">{r.description}</td>
                <td className="p-3 text-sm">
                  <StatusBadge status={r.status} />
                </td>
                <td className="p-3 text-sm">{moment(r.created_at).format('YYYY-MM-DD HH:mm')}</td>
                <td className="p-3 text-sm">
                  <Link
                    href={barangay.reports.show(r.id).url}
                    className="text-blue-600 underline text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (links are provided by Laravel paginator) */}
      <div className="mt-4">
        <nav className="flex items-center gap-2">
          {reports.links.map((link: any, idx: number) => (
            <span key={idx}>
              {link.url ? (
                <Link
                  href={link.url}
                  className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-blue-600 text-white' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <button className="px-3 py-1 border rounded text-sm" disabled dangerouslySetInnerHTML={{ __html: link.label }} />
              )}
            </span>
          ))}
        </nav>
      </div>
          </main>
          </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_review: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const cls = map[status] ?? 'bg-gray-100 text-gray-800';
  return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{status.replace('_', ' ')}</span>;
}
