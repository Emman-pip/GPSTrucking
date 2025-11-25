#!/bin/bash
php artisan migrate:fresh
php artisan db:seed BarangaySeeder
php artisan db:seed RoleSeeder
php artisan db:seed AdminUserSeeder

