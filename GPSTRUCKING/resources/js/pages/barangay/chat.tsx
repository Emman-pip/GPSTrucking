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

export default function Chat({unread, read, chatToAdmin}: {
    unread: Message[];
    read: Message[];
    chatToAdmin?: User[];
}) {
    console.log("UNREAD", unread, "READ", read)
    const { user } = usePage().props.auth;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />

            <main className="p-4 text-gray-900 dark:text-gray-200">

                {/* ADMIN LIST */}
{chatToAdmin && chatToAdmin.length > 0 && (
    <>
        <h1 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-600">
            Admins
        </h1>

        <section
            className="
                flex gap-3 overflow-x-auto pb-2
                scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
            "
        >
            {chatToAdmin.map(admin => (
                <Link key={admin.id} href={individualChat(admin.id)}>
                    <Card
                        className="
                            min-w-[230px] p-3 rounded-xl shadow-sm
                            dark:800/30
                            border border-gray-200 dark:border-gray-700
                            hover:bg-gray-100 hover:dark:bg-gray-700
                            transition
                            flex items-center gap-3
                        "
                    >
                        {/* Avatar */}
                        <div className="
                            w-12 h-12 rounded-full bg-green-200 dark:bg-green-900
                            flex items-center justify-center
                            text-green-700 dark:text-green-300
                            text-xl font-bold flex-shrink-0
                        ">
                    {admin.name.toUpperCase().charAt(0)}
                        </div>

                        {/* Name */}
                        <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-200">
                            {admin.name}
                        </CardTitle>
                    </Card>
                </Link>
            ))}
        </section>

        <div className="mb-6"></div>
    </>
)}

                {/* MAIN CHAT LIST */}
                <h1 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-600">Chats</h1>

                <section>
                    <div className="flex flex-col gap-2">

                        {read?.length > 0 ? (
                            read
                                .filter(msg => !unread?.map(u => u.data?.sender_id).includes(msg.data?.sender_id))
                                .map(message => {
                                    if (message.data?.sender_id === 0) return;

                                    try { message = JSON.parse(message); } catch {}

                                    return (
                                        <Link
                                            key={message.id}
                                            href={
                                                message.data?.sender_id !== 0
                                                    ? individualChat(message.data?.sender_id)
                                                    : '#'
                                            }
                                        >
                                            <Card
                                                className="
                                                    flex items-center p-3 rounded-xl shadow-sm
                                                    dark:800/30
                                                    border border-gray-200 dark:border-gray-700
                                                    hover:bg-gray-100 hover:dark:bg-gray-700
                                                    transition
                                                "
                                            >
                                                <CardTitle className="flex w-full items-center justify-between">

                                                    {/* LEFT SIDE */}
                                                    <div className={cn(
                                                        "flex items-center gap-3 w-full",
                                                        message?.read_at || user.name === message.data.real_sender_name
                                                            ? "font-normal"
                                                            : "font-semibold"
                                                    )}>

                                                        {/* Avatar */}
                                                        <div className="
                                                            w-12 h-12 rounded-full bg-green-200 dark:bg-green-900 aspect-square
                                                            flex items-center justify-center
                                                            text-green-700 dark:text-green-300
                                                            text-xl font-bold
                                                        ">
                                                            {message.data?.sender_name?.toUpperCase().charAt(0)}
                                                        </div>

                                                        {/* Name + Message */}
                                                        <div className="flex flex-col gap-2 w-full">
                                                            <span className="capitalize text-[15px] text-gray-900 dark:text-gray-200">
                                                                {message.data?.sender_name}
                                                            </span>
                                                            <small className="text-gray-500 dark:text-gray-400 truncate block max-w-[220px]">
                                                                <span className="capitalize text-gray-700 dark:text-gray-300">
                                                                    {message.data?.real_sender_name || message.data?.sender_name}:
                                                                </span> {message.data?.message}
                                                            </small>
                                                        </div>
                                                    </div>

                                                    {/* RIGHT SIDE: TIME + UNREAD */}
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            {new Date(message.created_at || '').toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>

                                                        {!message.read_at && (
                                                            <span className="w-3 h-3 bg-green-500 rounded-full mt-1"></span>
                                                        )}
                                                    </div>
                                                </CardTitle>
                                            </Card>
                                        </Link>
                                    );
                                })
                        ) : (
                            <Card className="p-4 rounded-xl shadow-sm dark:800/30 border border-gray-200 dark:border-gray-700">
                                <CardTitle className="font-light text-gray-500 dark:text-gray-400">
                                    No messages. Yay!
                                </CardTitle>
                            </Card>
                        )}

                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
