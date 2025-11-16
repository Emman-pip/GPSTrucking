import { Button } from '@/components/ui/button';
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown, Dot } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { individualChat } from '@/routes';

export interface MessageData {
    'message': string;
    'sender_id': number;
    'sender_name': string;
}

export interface Message {
    "id" ?: number;
    "type" ?: string;
    "notifiable_type" ?: string;
    "notifiable_id" ?: number;
    "data" ?: MessageData;
    "read_at" ?: null;
    "created_at" ?: string;
    "updated_at" ?: string;
    "sender_id" ?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chats',
        href: '#'
    }
];

export default function Chat({unread, read}: {
    unread: Message[];
    read: Message[];
}) {
    console.log(unread, read)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />
            <main className="p-2">
                <h1 className="text-2xl font-bold">Chats</h1>
                <section>
                    <div className="flex flex-col gap-1">
                    {unread?.length > 0 &&
                            unread.map(message => <Link href={individualChat(message.data?.sender_id)} className=""><Card className="transition-all duration-200 hover:bg-gray-300/30 px-2">
                            <CardTitle className="capitalize flex justify-between items-center">
                                <div className="flex flex-col gap-3">
                                {message.data?.sender_name}
                                <small>{message.data?.message}</small>
                                </div>
                                <Dot size={50} className="text-blue-500"/>
                            </CardTitle>
                        </Card></Link>)
                     }
                        {read?.length > 0 ?
                            read.filter(message =>
                                !unread.map(unreadmess => unreadmess.data?.sender_id)
                                    .includes(message.data?.sender_id))
                                .map(message =>
                                    <Link href={individualChat(message.data?.sender_id)} className=""><Card className="transition-all duration-200 hover:bg-gray-300/30 px-2">
                                        <CardTitle className="capitalize flex justify-between items-center">
                                            <div className="flex flex-col gap-3">
                                                {message.data?.sender_name}
                                                <small>{message.data?.message}</small>
                                            </div>
                                        </CardTitle>
                                    </Card></Link>)
                            : <Card className='p-4'>
                                <CardTitle className="font-thin">No messages. Yay!</CardTitle>
                            </Card>}
                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
