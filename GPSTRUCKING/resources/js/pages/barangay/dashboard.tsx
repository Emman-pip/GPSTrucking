import MapView from '@/components/map/MapView';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay from '@/routes/barangay';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Barangay Personel Dashboard',
        href: barangay.dashboard.url()
    }
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barangay Personel Dashboard" />
            <div className="p-4">
                <MapView />
            </div>
        </AppLayout>
    );
}
