<?php

namespace App\Filament\Widgets;

use App\Models\Barangay;
use App\Models\Route;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $allUsers = User::all();

        $residentCount = 0;
        $barangayOfficialCount = 0;

        foreach ($allUsers as $user) {
            if ($user->role->name === 'resident')
                $residentCount++;
            if ($user->role->name === 'barangay')
                $barangayOfficialCount++;
        }

        $activeBarangays = 0;

        $activeBarangays = Route::distinct('barangay_id')->count();

        return [
            Stat::make('Resident Users', $residentCount),
            Stat::make('Barangay Personnels', $barangayOfficialCount),
            Stat::make('Active Barangays', $activeBarangays),
        ];
    }
}
