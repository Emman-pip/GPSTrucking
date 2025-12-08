import '../css/app.css';

import { Toaster } from "@/components/ui/sonner"
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { configureEcho } from '@laravel/echo-react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// configureEcho({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY, // your Reverb key
//     wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
//     wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
//     cluster: '',
//     forceTLS: false,       // IMPORTANT
//     encrypted: false,      // IMPORTANT
//     wsProtocol: 'ws',      // force plain websocket
//     disableStats: true,
// });

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_REVERB_APP_KEY, // your Reverb key
    wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    cluster: '',
    forceTLS: false,       // IMPORTANT
    encrypted: false,      // IMPORTANT
    wsProtocol: 'ws',      // force plain websocket
    disableStats: true,
});


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster position='top-center' />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
