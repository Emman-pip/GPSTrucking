import React from 'react';
import AppLayout from '@/layouts/barangay/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import moment from 'moment';
import barangay from '@/routes/barangay';

type Report = {
  id: string;
  drop_site_id: number;
  description: string;
  status: string;
  created_at: string;
  user?: { id?: number; name?: string; email?: string };
  drop_site?: { id?: number; name?: string; latitude?: number; longitude?: number };
};

interface Props {
  report: Report;
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resident Reports',
        href: barangay.reports.index.url()
    },
    {
        title: 'Report',
        href: '#'
    }
];


export default function Show({ report }: Props) {
  const form = useForm({
    status: report.status,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post(barangay.reports.updateStatus(report.id).url, {
      preserveState: true,
      onSuccess: () => {
        // Could show toast; for now rely on server flash
        router.get("#");
      },
    });
  }

  return (
      <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Report ${report.id}`} />

          <main className="p-2">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Report Details</h1>
          <Link href={barangay.reports.index().url} className="text-sm text-blue-600 underline">Back to list</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-4 rounded shadow-sm">
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="whitespace-pre-wrap text-sm text-current/70">{report.description}</p>

          <div className="mt-6">
            <h3 className="text-sm font-medium">Reporter</h3>
            <p className="text-sm">{report.user?.name ?? '—'} {report.user?.email && <span className="text-current/70">({report.user.email})</span>}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium">Drop Site</h3>
            <p className="text-sm">{report.drop_site?.name ?? `ID: ${report.drop_site_id}`}</p>
            {report.drop_site?.latitude && report.drop_site?.longitude && (
              <div className="mt-2 text-sm text-current/70">
                Coordinates: {report.drop_site.latitude}, {report.drop_site.longitude}
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-current/70">
            Created: {moment(report.created_at).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>

        <div className="p-4 rounded shadow-sm">
          <h2 className="text-lg font-medium mb-4">Actions</h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={form.data.status}
                onChange={(e) => form.setData('status', e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option className="dark:text-black" value="pending">Pending</option>
                <option className="dark:text-black" value="in_review">In Review</option>
                <option className="dark:text-black" value="resolved">Resolved</option>
                <option className="dark:text-black" value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={form.processing}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update Status
              </button>

          <Link href={barangay.reports.index().url} className="px-4 py-2 border rounded text-sm">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
          </main>
          </AppLayout>
  );
}
