import MapBarangay from '@/components/map/MapBarangay';
import MapView  from '@/components/map/MapView';
import AppLayout from '@/layouts/resident/app-layout';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Barangay } from '../barangay/profileForm';
import { UpdateBarangay } from './updateProfile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Alerts',
        href: resident.dashboard.url()
    }
];

export default function Dashboard() {
    const { user } = usePage().props.auth;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
            hi world
            </div>
        </AppLayout>
    );
}
