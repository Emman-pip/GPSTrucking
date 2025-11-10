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
        href: barangay.dashboard.url()
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
export default function Dashboard({ barangay: barangayData }: {
    barangay: Barangay
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barangay Personel Dashboard" />
            <main className="p-4 flex flex-col gap-2">
                <section className="grid  auto-rows-fr gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <Card onClick={()=>router.get("#")} className="cursor-pointer border-gray-100 dark:border-gray-950 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6  transition-colors duration-300">
                        <CardTitle className="flex gap-2 items-center">
                            <CirclePlus />
                            Customize Map
                        </CardTitle>
                        <CardDescription>
                            Add pickup sites, routes, and more
                        </CardDescription>
                    </Card>
                        <Card onClick={() => router.get("#")} className="cursor-pointer border-gray-100 dark:border-gray-950 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6  transition-colors duration-300">
                            <CardTitle className="flex gap-2 items-center">
                                <Calendar />
                                Set Pickup Schedules
                            </CardTitle>
                            <CardDescription>
                                Set smart schedule notifications for your residents
                            </CardDescription>
                        </Card>
                        <Card onClick={()=>router.get(barangay.chats().url)} className="cursor-pointer border-gray-100 dark:border-gray-950 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6  transition-colors duration-300">
                            <CardTitle className="flex gap-2 items-center">
                                <MessageSquare />
                                Resident Chats
                            </CardTitle>
                            <CardDescription>
                                Communicate with residents in your barangay
                            </CardDescription>
                        </Card>
                    <Card onClick={() => router.get(barangay.profile().url)} className="cursor-pointer border-gray-100 dark:border-gray-950 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6  transition-colors duration-300">
                            <CardTitle className="flex gap-2 items-center">
                                <LucideUsers2 />
                                Visit Profile
                            </CardTitle>
                            <CardDescription>
                                Visit and edit your profile
                            </CardDescription>
                        </Card>
                </section>
                <MapBarangay coordinates={barangayData.coordinates} />
            </main>
        </AppLayout>
    );
}
