import MapBarangay from '@/components/map/MapBarangay';
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils';
import MapView from '@/components/map/MapView';
import AppLayout from '@/layouts/barangay/app-layout';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Bell, Clock, Dot, Siren } from 'lucide-react';
import { useEffect } from 'react';
import barangay from '@/routes/barangay';
import { isMap } from 'util/types';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '../resident/alerts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Alerts',
        href: barangay.alerts().url,
    }
];


function MakeAlertForm() {
    const { data, setData, post, processing } = useForm({
        'title': '',
        'message': '',
        'tags': [],
    });

    const handleCheckboxChange = (tag) => {
        if (data.tags.includes(tag)) {
            setData('tags', data.tags.filter(t => t !== tag));
        } else {
            setData('tags', [...data.tags, tag]);
        }
    };

    const availableTags = ['Urgent', 'Info', 'Maintenance', 'Schedule'];

    const handleSubmit = (e) => {
        if (!e.target.checkValidity()) return;
        e.preventDefault();
        post(barangay.alerts.post().url);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Create An Alert
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-green-700 dark:text-green-300">
                            Issue an Alert
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            Alerts are sent to all the residents of your barangay immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                required
                                defaultValue={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="A descriptive title..."
                                className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Alert Content</Label>
                            <Textarea
                                id="message"
                                required
                                defaultValue={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Describe the alert..."
                                className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Tags</Label>
                            {availableTags.map(tag => (
                                <label key={tag} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.tags.includes(tag)}
                                        onChange={() => handleCheckboxChange(tag)}
                                    />
                                    <span>{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="border-gray-400 dark:border-gray-600">Cancel</Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Save Alert
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export default function Alerts({ alerts, sentAlerts, allBarangayAlerts }) {
    const { user } = usePage().props.auth;

    useEffect(() => {
        return () => {
            router.put(resident.alerts.makeRead().url);
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <main className="p-4 pb-6 text-gray-900 dark:text-gray-200">

                {/* Header */}
                <div className="flex justify-between items-center w-full py-2">
                    <h1 className="text-2xl font-bold">Notifications & Feedback</h1>
                    <MakeAlertForm />
                </div>

                {/* Wrapper card */}
                <div className="
                    p-4 rounded-2xl shadow-sm
                    bg-white dark:bg-gray-900
                    border border-gray-200 dark:border-gray-700
                    flex flex-col gap-4
                ">
                    <Accordion type="single" collapsible defaultValue="item-1">

                        {/* -------------------------------------------------- */}
                        {/* NOTIFICATION FEED */}
                        {/* -------------------------------------------------- */}

                        <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-700">
                            <AccordionTrigger className="text-lg font-semibold">
                                Notification Feed
                            </AccordionTrigger>

                            <AccordionContent className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-1">

                                {alerts?.length > 0 ? alerts.map((alert, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "relative flex items-start gap-4 p-4 rounded-xl shadow-sm",
                                            "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                                            "hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        )}
                                    >
                                        {/* Icon Bubble */}
                                        <div className="
                                            w-12 h-12 rounded-full
                                            flex items-center justify-center
                                            bg-green-100 dark:bg-green-900
                                            text-green-700 dark:text-green-300
                                            flex-shrink-0
                                        ">
                                            <Bell className="w-6 h-6" />
                                        </div>

                                        {/* Text */}
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {!alert.read_at && (
                                                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                                                    )}
                                                    <span className="font-semibold">
                                                        {alert.data?.title}
                                                    </span>
                                                </div>

                                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                    {alert.created_at ? new Date(alert.created_at).toLocaleDateString() : ''}
                                                </span>
                                            </div>

                                            <div className="text-sm mt-1 text-gray-600 dark:text-gray-300 break-words">
                                                {alert.data?.message}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-gray-500 dark:text-gray-400">No alerts yet!</div>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {/* -------------------------------------------------- */}
                        {/* SENT NOTIFICATIONS */}
                        {/* -------------------------------------------------- */}

                        <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-700">
                            <AccordionTrigger className="text-lg font-semibold">
                                Sent Notifications
                            </AccordionTrigger>

                            <AccordionContent className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-1">
                                {sentAlerts?.length > 0 ? sentAlerts.map((alert, i) => (
                                    <div
                                        key={i}
                                        className="
                                            flex items-start gap-4 p-4 rounded-xl
                                            bg-gray-50 dark:bg-gray-800
                                            border border-gray-200 dark:border-gray-700
                                        "
                                    >
                                        <div className="
                                            w-12 h-12 rounded-full flex items-center justify-center
                                            bg-green-100 dark:bg-green-900
                                            text-green-700 dark:text-green-300
                                        ">
                                            <Bell className="w-6 h-6" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold">{alert.data?.title}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {alert.data?.message}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-gray-500 dark:text-gray-400">
                                        You haven’t issued any alerts yet.
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {/* -------------------------------------------------- */}
                        {/* ALL BARANGAY NOTIFICATIONS */}
                        {/* -------------------------------------------------- */}

                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg font-semibold">
                                Notifications from All Barangay Admins
                            </AccordionTrigger>

                            <AccordionContent className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto pr-1">
                                {allBarangayAlerts?.length > 0 ? allBarangayAlerts.map((alert, i) => (
                                    <div
                                        key={i}
                                        className="
                                            flex items-start gap-4 p-4 rounded-xl
                                            bg-gray-50 dark:bg-gray-800
                                            border border-gray-200 dark:border-gray-700
                                        "
                                    >
                                        <div className="
                                            w-12 h-12 rounded-full flex items-center justify-center
                                            bg-green-100 dark:bg-green-900
                                            text-green-700 dark:text-green-300
                                        ">
                                            <Bell className="w-6 h-6" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-semibold">{alert.data?.title}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {alert.data?.message}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-gray-500 dark:text-gray-400">
                                        No alerts issued for your barangay yet!
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </main>
        </AppLayout>
    );
}
