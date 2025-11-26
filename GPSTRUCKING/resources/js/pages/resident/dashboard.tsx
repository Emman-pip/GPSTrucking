import MapBarangay from '@/components/map/MapBarangay';
import MapView  from '@/components/map/MapView';
import AppLayout from '@/layouts/resident/app-layout';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Barangay } from '../barangay/profileForm';
import { UpdateBarangay } from './updateProfile';
import Submit from '../BarangayRatings/Submit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: resident.dashboard.url()
    }
];

import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { chat } from '@/routes';

interface DashboardProps {
  barangayData: Barangay;
  barangays: Barangay[];
  userRatingThisWeek: boolean;
}

export default function Dashboard({ barangayData, barangays, userRatingThisWeek }: DashboardProps) {
  const { auth } = usePage().props;
  const userName = auth.user.name;

  const today = format(new Date(), 'EEEE, MMMM do'); // Example: Monday, Nov 25th

  // Dummy data for KPI cards
  const activeBins = barangayData.bins?.length || 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <main className="p-2">
      {/* Hero / Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Good morning, {userName}!</h1>
        <p className="mt-1 text-sm md:text-base">{today}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Active Bins */}
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Active Bins</span>
          <span className="text-2xl font-bold mt-2">{activeBins}</span>
        </div>

        {/* Rating This Week */}
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow flex flex-col items-center">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Rated This Week</span>
          <span className={`text-2xl font-bold mt-2 ${userRatingThisWeek ? 'text-green-500' : 'text-red-500'}`}>
            {userRatingThisWeek ? 'Yes' : 'No'}
          </span>
        </div>

        {/* Quick Action */}
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow flex flex-col items-center justify-center" onClick={()=>router.get(chat().url)}>
            <MessageSquare/>
          <span className="text-sm font-semibold text-gray-500/50 dark:text-gray-400/50">Chat Admins</span>

        </div>
      </div>

      {/* Map Barangay */}
      <div className="w-full h-[60vh] rounded-xl overflow-hidden shadow">
        <MapBarangay barangayCoordinates={barangayData.coordinates} />
      </div>

      {/* Optional Update Form Below */}
      <div className="w-full py-4">
        <UpdateBarangay barangays={barangays} barangayData={barangayData} />
      </div>

      {/* Submit Rating */}
      <Submit auth={auth} userRatingThisWeek={userRatingThisWeek} />
        </main>
    </AppLayout>
  );
}
