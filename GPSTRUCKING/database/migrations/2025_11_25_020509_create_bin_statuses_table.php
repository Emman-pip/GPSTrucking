<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bin_statuses', function (Blueprint $table) {
            $table->id();
            $table->enum('status', [
                'collected',
                'uncollected',
                'pending',
                'missed'
            ])->default('pending');
            $table->foreignId('bin_id')->constrained('drop_sites', 'id')
                ->cascadeOnDelete();
            $table->integer('week_number')->default(now()->weekOfYear);
            $table->year('year')->default(now()->year);
            $table->unique([
                'bin_id', 'week_number', 'year'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bin_statuses');
    }
};
