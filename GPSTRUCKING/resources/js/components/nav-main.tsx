import { cn } from '@/lib/utils';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import count from '@/routes/count';
import { type NavItem } from '@/types';
import { Link, usePage, useRemember } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [chatCount, setChatCount] = useRemember(0);
    const [alertsCount, setAlertsCount] = useRemember(0);

    const { auth } = usePage().props;
    const userId = auth.user.id;

    useEffect(() => {
        fetch(count.chats().url).then(res => res.json())
            .then(res => setChatCount(res.count));
        fetch(count.alerts().url).then(res => res.json())
            .then(res => setAlertsCount(res.count));
    }, []);

    useEffect(() => {
        if (!userId) return;

        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.notification((notification) => {
            fetch(count.chats().url).then(res => res.json())
                .then(res => setChatCount(res.count));
            fetch(count.alerts().url).then(res => res.json())
                .then(res => setAlertsCount(res.count));
            // You can update local state or show a toast here
        });

        return () => {
            window.Echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId]);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>

                                {item.icon &&
                                    <div className="relative">
                                        <item.icon />
                                        { item.count === true
                                            && (item.title.toLocaleLowerCase().includes('alert') || item.title.toLocaleLowerCase().includes('chat'))
                                            && item.title.toLocaleLowerCase().includes('alert') ? alertsCount > 0 : chatCount > 0
                                            && <div className={ cn("absolute -top-1 -right-1 text-[0.7rem] text-white rounded-2xl aspect-square size-4 justify-center flex items-center bg-red-500",
                                                                  item.count !== true && "hidden") }>
                                                {item.title.toLocaleLowerCase().includes('alert') &&
                                                    alertsCount}
                                                {item.title.toLocaleLowerCase().includes('chat') &&
                                                    chatCount}
                                            </div>
                                        }
                                    </div>
                                    }
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
