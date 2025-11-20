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
            <main className="p-2">
                {chatToAdmin && chatToAdmin?.length > 0 &&
                    <>
                        <h1 className="text-2xl font-bold">Admins</h1>
                        <section className=" border p-2 rounded-xl grid md:grid-cols-3 gap-2 m-2 ">
                            {chatToAdmin.map(admin => {
                                return <Link href={individualChat(admin.id)}>
                                    <Card className="transition-all duration-200 hover:bg-gray-300/30">
                                        <CardTitle className="p-2">
                                            {admin.name}
                                        </CardTitle>
                                    </Card>
                                </Link>
                            })}
                        </section>
                    </>
                }
                <h1 className="text-2xl font-bold">Chats</h1>
                <section>
                    <div className="flex flex-col gap-1">
                        {/*unread?.length > 0 &&
                unread.map(message => {
                    if (message.data?.sender_id === 0 ) {
                        return
                    }
                    return <Link href={message.data?.sender_id !== 0 ? individualChat(message.data?.sender_id) : '#'} className=""><Card className="transition-all duration-200 hover:bg-gray-300/30 px-2">
                        <CardTitle className="capitalize flex justify-between items-center">
                        <div className="flex flex-col gap-3">
                        {message.data?.sender_name}
                        <small>{message.data?.message}</small>
                        </div>
                        <Dot size={50} className="text-blue-500"/>
                        </CardTitle>
                        </Card></Link>})
                     */}
                        {read?.length > 0 ?
                            read.filter(message =>
                                !unread?.map(unreadmess => unreadmess.data?.sender_id)
                                    ?.includes(message.data?.sender_id))
                                ?.map(message => {
                                    console.log("here", message)
                                    if (message.data?.sender_id === 0) {
                                        return;
                                    }
                                    try {
                                        message = JSON.parse(message);
                                    } catch (e) {}
                                    return <Link href={message.data?.sender_id !== 0 ? individualChat(message.data?.sender_id) : '#'} className=""><Card className="transition-all duration-200 hover:bg-gray-300/30 px-2">
                                        <CardTitle className="flex justify-between items-center">
                                            <div className={cn("flex items-center gap-2", message?.read_at || user.name === message.data.real_sender_name ? "font-thin" : "")}>
                                                <UserInfo showName={false} user={{ name: message.data?.sender_name }} />

                                                <div className="flex gap-1 flex-col">
                                                    <div className="capitalize flex gap-2 items-center">
                                                        {message.data?.sender_name}
                                                    </div>
                                                    <small className='break-all'><span className="capitalize">{message.data?.real_sender_name ? message.data?.real_sender_name : message.data?.sender_name} </span>: {message.data?.message}</small>
                                                </div>
                                            </div>
                                        </CardTitle>
                                    </Card></Link>
                                })
                            : <Card className='p-4'>
                                <CardTitle className="font-thin">No messages. Yay!</CardTitle>
                            </Card>}
                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
