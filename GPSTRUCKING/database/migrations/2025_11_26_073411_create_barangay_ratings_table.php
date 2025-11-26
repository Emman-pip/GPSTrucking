<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangay_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned(); // 1–5
            $table->date('week_start');
            $table->timestamps();

            $table->unique(['barangay_id', 'user_id', 'week_start'], 'unique_weekly_rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barangay_ratings');
    }
};
