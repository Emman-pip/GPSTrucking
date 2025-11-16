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

export interface Message {
    "id" ?: number;
    "type" ?: string;
    "notifiable_type" ?: string;
    "notifiable_id" ?: number;
    "data" ?: JSON;
    "read_at" ?: null;
    "created_at" ?: string;
    "updated_at" ?: string;
    "sender_id" ?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chats',
        href: barangay.chats().url
    }
];

export default function ProfileForm({unread, read}: {
    unread: Message[];
    read: Message[];
}) {
    console.log(unread, read)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />
        </AppLayout>
    );
}
