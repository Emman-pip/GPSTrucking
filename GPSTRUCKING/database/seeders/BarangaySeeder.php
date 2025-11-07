<?php

namespace Database\Seeders;

use App\Models\Barangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = [
            ["name" => "Bagong Pook", "coordinates" => [121.1761, 14.0381]],
            ["name" => "Bilucao", "coordinates" => [121.1106, 14.0351]],
            ["name" => "Bulihan", "coordinates" => [121.1387, 14.0359]],
            ["name" => "Luta del Norte", "coordinates" => [121.1585, 14.0390]],
            ["name" => "Luta del Sur", "coordinates" => [121.1605, 14.0347]],
            ["name" => "Poblacion", "coordinates" => [121.1583, 14.0449]],
            ["name" => "San Andres", "coordinates" => [121.1514, 14.0031]],
            ["name" => "San Fernando", "coordinates" => [121.1598, 14.0276]],
            ["name" => "San Gregorio", "coordinates" => [121.1231, 14.0445]],
            ["name" => "San Isidro East", "coordinates" => [121.1248, 14.0394]],
            ["name" => "San Juan", "coordinates" => [121.1469, 14.0188]],
            ["name" => "San Pedro I", "coordinates" => [121.1454, 14.0536]],
            ["name" => "San Pedro II", "coordinates" => [121.1361, 14.0493]],
            ["name" => "San Pioquinto", "coordinates" => [121.1554, 14.0538]],
            ["name" => "Santiago", "coordinates" => [121.1638, 14.0151]],
        ];

        foreach ($barangays as $brgy) {
            Barangay::create([
                'name' => $brgy['name'],
                'coordinates' => json_encode($brgy['coordinates']),
            ]);
        };
    }
}
