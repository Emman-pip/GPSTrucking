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
import { BookOpen, Folder, LayoutGrid, Map, MessageSquare, User } from 'lucide-react';
import AppLogo from './app-logo';
import barangay from '@/routes/barangay';
import resident from '@/routes/resident';
import { useEffect } from 'react';
import { chat } from '@/routes';

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
    },
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
    },
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

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const userId = auth.user.id;
    useEffect(() => {
        if (!userId) return;

        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.notification((notification) => {
            console.log(notification);
            router.reload();
            // You can update local state or show a toast here
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
