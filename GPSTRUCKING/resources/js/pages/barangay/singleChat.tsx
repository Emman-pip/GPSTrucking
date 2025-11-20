import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DetailedHTMLProps, HTMLAttributes, Ref, RefObject, useEffect, useRef, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown, Dot, Send } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Message } from './chat';
import { User } from './editProfile';
import { chat, sendChat } from '@/routes';
import { UserInfo } from '@/components/user-info';

export const ChatBubbleMaker = ({message, user}: {message: Message, user: User}) => {

    let bubbleStyle = "justify-start";
    let boxStyle = "bg-green-500/80 rounded-bl-none";
    if (message.notifiable_id !== user.id) {
        bubbleStyle = "justify-end";
        boxStyle = "bg-gray-400/30 rounded-br-none";
    }
    if (!message.data?.message) return;
    return <div className={cn(bubbleStyle, "w-full flex")}>
        <div className={cn("rounded-lg break-all p-2 shadow-lg", boxStyle)}>
            {message.data?.message}
        </div>
    </div>
}

export default function SingleChat({ chatMate, messages }: {
    messages: Message[];
    chatMate: User;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chats',
            href: chat().url
        },
        {
            title: chatMate.name,
            href: '#'
        }
    ]
    const user = usePage().props.auth.user;

    const [message, setMessage] = useState('');
    const send = async (e : FormEvent) =>  {
        e.preventDefault();
        if (!message) return;
        await router.post(sendChat().url, {
            message: message,
            id: chatMate.id
        }, {
            onSuccess: () => {
                setMessage('');
            }
        })
    }


    const userId = user.id;
    const goDown = useRef<Ref<HTMLElement>|null>(null);
    useEffect(() => {
        /* const goDown = useRef<Ref<HTMLElement>|null>(null); */
        goDown.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, userId]);


    const [extraMessages, setExtraMessages] = useState([]);
    useEffect(() => {
        if (!userId) return;

        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.notification((notification) => {
            setExtraMessages(prev => [...prev, notification])
            // You can update local state or show a toast here
        });

        return () => {
            window.Echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />
            <main className="p-2">
                <Card className="shadow-lg flex justify-between">

                    <CardTitle className="capitalize px-2 flex items-center gap-2">
                        <UserInfo showName={false} user={chatMate} />
                        {chatMate.name}
                    </CardTitle>
                </Card>
                <section className="flex flex-col p-2 pb-16 h-full gap-1 max-h-[70vh] overflow-y-scroll" style={{ scrollbarWidth:"none" }}>
                    {messages && messages.map((message) => <ChatBubbleMaker message={message} user={user} />)}
                    {extraMessages && extraMessages.map((message) => <ChatBubbleMaker message={message} user={user} />)}
                    {!messages && <div>No messages yet.</div>}
                    <div ref={goDown}></div>
                </section>
                <section className="absolute bottom-0 left-0 right-0 p-2">
                    <form className="flex gap-1" onSubmit={send}>
                        <Input className="focus:ring backdrop-blur-sm " type="text" placeholder="Type your message here" onChange={(e) => setMessage(e.target.value)} value={message} />
                        <Button type="submit"><Send /></Button>
                    </form>
                </section>

            </main>
        </AppLayout>
    );
}
