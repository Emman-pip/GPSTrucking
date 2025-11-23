import MapBarangay from '@/components/map/MapBarangay';
import { cn } from '@/lib/utils';
import MapView  from '@/components/map/MapView';
import AppLayout from '@/layouts/resident/app-layout';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Barangay } from '../barangay/profileForm';
import { UpdateBarangay } from './updateProfile';
import { Bell, Clock, Dot, Siren } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Alerts',
        href: resident.alerts().url,
    }
];

export interface Alert {
    "id"?: number;
    "type"?: string;
    "notifiable_type"?: string
    "notifiable_id"?: number;
    "data"?: {
        "title": string,
        "message": string,
        "tags": string[]
    };
    "read_at"?: string|null;
    "created_at"?: string;
    "updated_at"?: string;
    "sender_id"?: number|null;
}

export default function Alerts({ alerts }: {
    alerts: Alert[];
}) {
    const { user } = usePage().props.auth;
    console.log(alerts);
    useEffect(() => {
        console.log("not marking yet! ")
        return () => {
            return router.put(resident.alerts.makeRead().url);
        }
    }, [])
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <main className="p-2 pb-4">
                <div>
                    <div className="text-xl font-bold">Notifications & Feedback</div>
                </div>
                <div className="p-2 border border-current/30  flex flex-col gap-2 rounded-xl">
                    <div className="font-semibold text-lg">Notification feed</div>
                    <div className="flex flex-col gap-2 max-h-[100vh] overflow-y-auto">
                        {
                            alerts?.length > 0 ? alerts.map((alert, index) => {
                                return <div className={ cn( "rounded-sm flex items-center gap-2  border border-current/50 p-2", alert.read_at ? "border-current/30" : "" )}>
                                    <div className="bg-blue-500/40 p-2 rounded-lg">
                                        <Bell className="text-blue-700"/>
                                    </div>
                                    <div>
                                        <div className="font-semibold flex gap-1 items-center break-words">{ !alert.read_at ? <Dot size={30} className="text-red-500"/> : ""}{alert.data?.title}</div>
                                        <div className="text-sm font-thin opacity-60 break-words">{alert.data?.message}</div>
                                    </div>
                                </div>
                            }) : <div>
                                No alerts yet!
                            </div>

                        }
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
