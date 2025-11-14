<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class UserChart extends ChartWidget
{
    protected ?string $heading = 'User Chart';
    protected string $color = 'success';

    protected function getData(): array
    {
        $this->columnSpan = 'full';

        $users = User::all(); // or apply filters like last 7 days

        $usersPerDay = $users->groupBy(function ($user) {
            return Carbon::parse($user->created_at)->format('Y-m-d');
        })->map(function ($group) {
            return count($group);
        });

        $dates = collect(range(0, 6))->map(fn($i) => Carbon::now()->subDays($i)->format('Y-m-d'))->reverse();

        $usersPerDay = $dates->mapWithKeys(function ($date) use ($usersPerDay) {
            return [$date => $usersPerDay[$date] ?? 0];
        });

        $usersPerDay = $usersPerDay->toArray();

        return [
            'datasets' => [
                [
                    'label' => 'New Users',
                    'data' => array_values($usersPerDay)
                ],
            ],
            'labels' => array_keys($usersPerDay),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
