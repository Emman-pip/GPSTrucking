import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Map, MessageSquare, Siren, TriangleAlert, Truck, User } from 'lucide-react';
import AppLogo from './app-logo';
import barangay from '@/routes/barangay';
import resident from '@/routes/resident';
import { useEffect, useState } from 'react';
import { chat, individualChat } from '@/routes';
import count, { chats } from '@/routes/count';
import { toast } from 'sonner';
import { Button } from '@headlessui/react';


export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const userId = auth.user.id;

    const [ chatCount, setChatCount ] = useState(0);
    const [ alertsCount, setAlertsCount ] = useState(0);

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: resident.dashboard().url,
            icon: LayoutGrid,
        },
        {
            title: 'Chats',
            href: chat().url,
            icon: MessageSquare,
            count: true
        },
        {
            title: 'Alerts',
            href: resident.alerts().url,
            icon: Siren,
        }
    ];



    const adminMainNavItems: NavItem[] = [
        {
            title: 'Admin Dashboard',
            href: '#',
            icon: LayoutGrid,
        },
    ];

    const BarangayMainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: barangay.dashboard.url(),
            icon: LayoutGrid,
        },
        {
            title: 'Map',
            href: barangay.map.url(),
            icon: Map,
        },
        {
            title: 'Profile',
            href: barangay.profile.url(),
            icon: User,
        },
        {
            title: 'Chats',
            href: chat().url,
            icon: MessageSquare,
            count: true,
        },
        {
            title: 'Trucks and Drivers',
            href: barangay.drivers().url,
            icon: Truck,
        },
        {
            title: 'Notifications & Alerts',
            href: barangay.alerts().url,
            icon: Siren,

        },
        {
            title: 'Reports',
            href: barangay.reports.index().url,
            icon: TriangleAlert,
        }
    ];


    const footerNavItems: NavItem[] = [
        // {
        //     title: 'Repository',
        //     href: 'https://github.com/laravel/react-starter-kit',
        //     icon: Folder,
        // },
        // {
        //     title: 'Documentation',
        //     href: 'https://laravel.com/docs/starter-kits#react',
        //     icon: BookOpen,
        // },
    ];

    useEffect(() => {
        if (!userId) return;

        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.notification((notification) => {
            router.reload();
            if (notification.type.toLowerCase().includes('message')) {
                toast(notification?.sender_name + " has sent a message", {
                    description: notification?.message.substr(0, 10 < notification.message.length ?  10: notification.message.length),
                    action: {
                        label: "view",
                        onClick: () => router.get(individualChat(notification.sender_id).url)
                    },
                })
            }
        });

        return () => {
            window.Echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={'#'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={auth.user.role_id === 3 ? BarangayMainNavItems : auth.user.role_id === 2 ? mainNavItems : adminMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
