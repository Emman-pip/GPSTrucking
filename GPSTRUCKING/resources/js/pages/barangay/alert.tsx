import MapBarangay from '@/components/map/MapBarangay';
import { Button } from "@/components/ui/button"
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
import MapView  from '@/components/map/MapView';
import AppLayout from '@/layouts/barangay/app-layout';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Barangay } from '../barangay/profileForm';
import { UpdateBarangay } from './updateProfile';
import { Bell, Clock, Dot, Siren } from 'lucide-react';
import { useEffect } from 'react';
import barangay from '@/routes/barangay';
import { isMap } from 'util/types';
import { Textarea } from '@/components/ui/textarea';

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
            // Remove tag if already selected
            setData('tags', data.tags.filter(t => t !== tag));
        } else {
            // Add tag if not selected
            setData('tags', [...data.tags, tag]);
        }
    };

    const availableTags = ['Urgent', 'Info', 'Maintenance', 'Schedule'];


    const handleSubmit = (e) => {
        if (!e.target.checkValidity()) {
            return;
        }
        e.preventDefault();
        post(barangay.alerts.post().url); // your route here
    };

    return (
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Create An Alert</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>

          <DialogHeader>
            <DialogTitle>Issue an alert or notification</DialogTitle>
            <DialogDescription>
                Alerts are sent to all the residents of your barangay the moment it is issued.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={data.title} placeholder="A descriptive title..." onChange={(e)=>setData('title', e.target.value)} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="message">Alert content</Label>
              <Textarea id="message" name="message" defaultValue={data.message} placeholder="A description of the alert..." onChange={(e) => setData('message', e.target.value)} required />
            </div>
            <div className="grid gap-2">
                <Label>Tags</Label>
                {availableTags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                        <input
                                        type="checkbox"
                            value={tag}
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
      </form>
        </DialogContent>
    </Dialog>
  )
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
                <div className="flex justify-between items-center w-full py-2">
                    <div className="text-xl font-bold">Notifications & Feedback</div>
                    <MakeAlertForm/>
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
