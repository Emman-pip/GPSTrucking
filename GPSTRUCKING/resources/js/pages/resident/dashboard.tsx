import MapBarangay from '@/components/map/MapBarangay';
import MapView  from '@/components/map/MapView';
import AppLayout from '@/layouts/resident/app-layout';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Barangay } from '../barangay/profileForm';
import { UpdateBarangay } from './updateProfile';
import Submit from '../BarangayRatings/Submit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: resident.dashboard.url()
    }
];

export default function Dashboard({ barangayData, barangays, userRatingThisWeek }:{
    barangayData: Barangay;
    barangays: Barangay[];
    userRatingThisWeek: boolean;
}) {
    const { auth } = usePage().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4 h-100">
            <MapBarangay barangayCoordinates={barangayData.coordinates} />
            <div className="w-full py-2">
            <UpdateBarangay barangays={barangays} barangayData={barangayData}/>
            </div>
            </div>
            <Submit auth={auth} userRatingThisWeek={userRatingThisWeek}/>
            </AppLayout>
    );
}
