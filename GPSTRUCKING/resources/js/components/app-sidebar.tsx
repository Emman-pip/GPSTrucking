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
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Map, User } from 'lucide-react';
import AppLogo from './app-logo';
import barangay from '@/routes/barangay';
import { BarangayMenuContent } from './barangay/user-menu-content';

const mainNavItems: NavItem[] = [
    {
        title: 'Resident Dashboard',
        href: '#',
        icon: LayoutGrid,
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
        href: barangay.chats.url(),
        icon: LayoutGrid,
    },
];


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
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
