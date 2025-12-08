import { Button } from '@/components/ui/button';
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/resident/app-layout';
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { User, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';
import { Barangay } from '../barangay/profileForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resident Profile Form',
        href: resident.profileForm().url,
    }
];

export interface Residency {
    user_id?: number;
    barangay_id?: number;
    barangay?: Barangay;
}

export default function ProfileForm({ barangays }: { barangays: Barangay[] }) {
    const { data, setData, post, processing, errors } = useForm({
        barangay_id: null,
        barangay: '',
    })
    const [open, setOpen] = useState(false);

    function submit(e: FormEvent) {
        if (!e.target.checkValidity()) {
            return;
        }
        e.preventDefault()
        post(resident.profileForm.submit().url,
             {
            forceFormData: true,
        });
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barangay Personel Dashboard" />

            <form onSubmit={submit} className="space-y-6 max-w-md mx-auto p-6 shadow-lg rounded-2xl w-full m-4">
            <h1 className="text-lg font-bold">Set Residency</h1>
            <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full flex justify-between items-center border px-3 py-2 rounded-lg dark:bg-neutral-800 dark:text-white">
            {data.barangay || "Select Barangay"}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </PopoverTrigger>

            <PopoverContent
        className="
p-0
w-full
sm:w-64
max-h-60
overflow-y-auto
dark:bg-neutral-800
"
        align="start"
            >
            <Command>
            <CommandInput placeholder="Search barangay (Limited to Malvar Batangas)..." />
            <CommandGroup>
            {barangays.map((brgy) => (
                <CommandItem
                key={brgy.id}
                onSelect={() => {
                    setData("barangay", brgy.name);
                    setData("barangay_id", brgy.id);
                    setOpen(false);
                }}
                    >
                    {brgy.name}
                </CommandItem>
            ))}
        </CommandGroup>
            </Command>
            </PopoverContent>
            </Popover>

            {errors.barangay_id && <div className="text-red-500">{errors.barangay_id}</div>}
        </div>

            <Button className="w-full">
            Submit
        </Button>
            </form>
            </AppLayout>
    );
}
