import { Button } from '@/components/ui/button';
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Barangay Personnel Profile form',
        href: barangayProfileForm.url(),
    }
];

export interface Barangay {
    id: number;
    name: string;
    coordinates: [number, number];
}

export default function ProfileForm({ barangays }: { barangays: Barangay[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        'barangay_official_id': '',
        'proof_of_identity': [],
        'contact_number': '',
        'email': '',
        'barangay_id': 0,
        'barangay': ''
    })

    function submit(e: FormEvent) {
        if (!e.target.checkValidity()) {
            return;
        }
        e.preventDefault()
        post(submitBarangayProfileForm.url(),
            {
            forceFormData: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barangay Personel Dashboard" />
            <div className="p-4">
                <form onSubmit={submit} className="space-y-6 max-w-md mx-auto p-6 bg-white dark:bg-neutral-950 shadow-lg rounded-2xl">

                    <div className="space-y-2">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger className="w-full flex justify-between items-center border px-3 py-2 rounded-lg dark:bg-neutral-800 dark:text-white">
                                {data.barangay || "Select Barangay"}
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </PopoverTrigger>

                            <PopoverContent className="p-2 w-[250px]">
                                <Command>
                                    <CommandInput placeholder="Search barangay (Limited to Malvar batangas)..." />
                                    <CommandGroup className="max-h-[30vh] overflow-y-auto">
                                        {barangays.map((brgy, index) => (
                                            <CommandItem
                                                key={index}
                                                onMouseDown={() => {
                                                    setData("barangay", brgy.name);
                                                    setData("barangay_id", brgy.id);
                                                    console.log("selected", data);
                                                }}
                                                onSelect={() => {
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
                    </div>
                    <div className="space-y-2">
                        <Label className="text-neutral-800 dark:text-neutral-200" htmlFor="email">Official Email</Label>
                        <Input className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>


                    <div className="space-y-2">
                        <Label className="text-neutral-800 dark:text-neutral-200" htmlFor="contact_number">Contact Number</Label>
                        <Input className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            id="contact_number"
                            type="tel"
                            pattern="[0-9]{11}"
                            value={data.contact_number}
                            onChange={(e) => setData("contact_number", e.target.value)}
                            required
                        />
                        {errors.contact_number && (
                            <p className="text-red-500 text-sm">{errors.contact_number}</p>
                        )}
                    </div>


                    <div className="space-y-2">
                        <Label className="text-neutral-800 dark:text-neutral-200" htmlFor="proof_of_identity">Proof Of Authority</Label>
                        <Input className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            id="proof_of_identity"
                            type="file"
                            onChange={(e) => setData("proof_of_identity", e.target.files[0])}
                            required
                        />
                        {errors.proof_of_identity && (
                            <p className="text-red-500 text-sm">{errors.proof_of_identity}</p>
                        )}
                    </div>


                    <div className="space-y-2">
                        <Label className="text-neutral-800 dark:text-neutral-200" htmlFor="barangay_official_id">Valid ID</Label>
                        <Input className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            id="barangay_official_id"
                            type="file"
                            onChange={(e) => setData("barangay_official_id", e.target.files[0])}
                            required
                        />
                        {errors.barangay_official_id && (
                            <p className="text-red-500 text-sm">{errors.barangay_official_id}</p>
                        )}
                    </div>

                    <Button className="w-full">
            Submit
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
