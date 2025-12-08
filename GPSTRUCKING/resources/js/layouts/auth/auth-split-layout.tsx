import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardTitle } from '@/components/ui/card';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">

                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-bl from-green-700/90 to-green-500/80
                    dark:from-emerald-900/90 dark:to-green-700/80">
                </div>

                {/* Content container */}
                <div className="relative z-20 flex h-full flex-col justify-between">

                    {/* Logo + Name */}
                    <Link
                        href={home()}
                        className="flex items-center text-lg font-medium"
                    >
                        <img
                            src="/images/LOGO2.svg"
                            className="h-10 w-10 object-contain"
                        />
                        <span className="ml-2">{name}</span>
                    </Link>

                    {/* Quote section */}
                    <div className="pb-6">
                        <p className="text-2xl font-light leading-snug max-w-sm opacity-95">
                            “Small actions, big impact.”
                        </p>
                    </div>

                </div>

            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
