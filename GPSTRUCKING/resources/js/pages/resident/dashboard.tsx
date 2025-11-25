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
        title: 'Dashboard',
        href: resident.dashboard.url()
    }
];

export default function Dashboard({ barangayData, barangays }:{
    barangayData: Barangay;
    barangays: Barangay[];
}) {
    const { user } = usePage().props.auth;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <MapBarangay barangayCoordinates={barangayData.coordinates} />
                <div className="w-full flex h-120 justify-end py-2">
                    <UpdateBarangay barangays={barangays} barangayData={barangayData}/>
                </div>
            </div>
        </AppLayout>
    );
}
