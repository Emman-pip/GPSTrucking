import { Button } from '@/components/ui/button';
import { useState } from "react";
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown, Dot } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { individualChat } from '@/routes';
import { UserInfo } from '@/components/user-info';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Drivers and Trucks',
        href: '#'
    }
];

export default function Drivers() {
    const { user } = usePage().props.auth;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Drivers and Trucks" />
            <main className="p-2">
                hi world
            </main>
        </AppLayout>
    );
}
