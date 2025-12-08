import { Button } from '@/components/ui/button';
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown, MapPin } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/resident/app-layout';
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { User, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';
import { Barangay } from '../barangay/profileForm';


export function UpdateBarangay({ barangays, barangayData }: { barangays: Barangay[], barangayData: Barangay }) {
    const { data, setData, put, processing, errors } = useForm({
        barangay_id: barangayData.id,
        barangay: barangays.filter(e => e.id === barangayData.id)[0].name,
    })
    const [open, setOpen] = useState(false);

    function submit(e: FormEvent) {
        if (!e.target.checkValidity()) {
            return;
        }
        e.preventDefault()
        console.log(data);
        put(resident.profileForm.update().url, {
            onSuccess: () => router.get('#')
        });
    }


    return (
        <Dialog>
            <DialogTrigger>
            <Button variant={"outline"}><MapPin/>Change Residency</Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
            <DialogTitle>Update residency</DialogTitle>
            <DialogDescription>
            <form onSubmit={submit} className="space-y-6 max-w-md mx-auto p-6 bg-white dark:bg-neutral-950 rounded-2xl w-full m-4">

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
            Save
        </Button>
            </form>
            </DialogDescription>
            </DialogHeader>
            </DialogContent>
            </Dialog>
    );
}
