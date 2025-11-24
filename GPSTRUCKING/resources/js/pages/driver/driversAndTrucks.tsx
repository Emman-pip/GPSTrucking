import AppLayout from '@/layouts/driver/app-layout'
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';
import { Barangay } from '../barangay/profileForm';
import MapBarangay from '@/components/map/MapBarangay';
// create ui for drivers and trucks here that includes:
// 1. map with markers specific to their barangay
// 2. map with routes specific to their barangay
// 3. button to start the garbage collection session - will notify
// 4. ability to add status to markers
// 5. button to end the garbage collection - will notify

// currently
// creating the UI
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Drivers and Trucks',
        href: '#'
    }
];

export default function DriversAndTrucks({
    user,
    barangay,
}: {
    user: User
    barangay: Barangay,
}) {
    console.log(user, barangay);
    return (<AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Drivers and Trucks" />
        <div>Hi world</div>
        <MapBarangay barangayCoordinates={barangay.coordinates} userData={user} />
        </AppLayout>
    )

}
