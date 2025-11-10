import MapBarangay from '@/components/map/MapBarangay';
import MapView from '@/components/map/MapView';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay from '@/routes/barangay';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Barangay } from './profileForm';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Calendar, CirclePlus, CloudAlert, LucideChartArea, PersonStanding, MessageCircle, MessageSquare, LucideUsers2} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Barangay Personel Dashboard',
        href: barangay.dashboard().url
    },
    {
        title: 'Customize Map',
        href: barangay.map().url
    }
];

// create a map that can:
// [ ] give initial coordinates (of barangay)
// give an option to get accurate GPS information
// give the barangay the capability to add
//    new markers (dropsites)
//       description
//       photo
//       location
//    new routes
//
export default function CustomizeMap() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barangay Personel Dashboard" />
            <main className="p-4 flex flex-col gap-2">
                hi po
            </main>
        </AppLayout>
    );
}
