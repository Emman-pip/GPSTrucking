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

export default function Alerts({ alerts }: { alerts: Alert[] }) {
    const { user } = usePage().props.auth;

    useEffect(() => {
        return () => {
            return router.put(resident.alerts.makeRead().url);
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <main className="p-4 pb-6 text-gray-800 dark:text-gray-200">
                <h1 className="text-2xl font-bold mb-4">Notifications & Feedback</h1>

                <section
                    className="
                        p-4 rounded-2xl shadow-sm
                        bg-white dark:bg-gray-900/30
                        border border-gray-200 dark:border-gray-700
                        flex flex-col gap-4
                    "
                >
                    <div className="text-lg font-semibold text-green-700 dark:text-green-400">
                        Notification Feed
                    </div>

                    <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1">

                        {alerts?.length > 0 ? (
                            alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "relative flex items-start gap-4 p-4 rounded-xl shadow-sm",
                                        "bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700",
                                        "transition hover:bg-gray-100 hover:dark:bg-gray-700"
                                    )}
                                >
                                    {/* Icon bubble */}
                                    <div
                                        className="
                                            w-12 h-12 flex items-center justify-center rounded-full
                                            bg-green-100 dark:bg-green-900
                                            text-green-700 dark:text-green-300
                                            flex-shrink-0
                                        "
                                    >
                                        <Bell className="w-6 h-6" />
                                    </div>

                                    {/* Title + Message */}
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                {!alert.read_at && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                                )}
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {alert.data?.title}
                                                </span>
                                            </div>

                                            {/* Right-side date (like template) */}
                                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                {alert.created_at
                                                    ? new Date(alert.created_at).toLocaleDateString()
                                                    : ""}
                                            </span>
                                        </div>

                                        <div className="text-sm mt-1 text-gray-600 dark:text-gray-300 break-words">
                                            {alert.data?.message}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400">No alerts yet!</div>
                        )}

                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
