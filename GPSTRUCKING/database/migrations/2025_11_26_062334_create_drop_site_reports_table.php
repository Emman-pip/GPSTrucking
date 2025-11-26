<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drop_site_reports', function (Blueprint $table) {
            // Primary key (UUID or auto-increment — your choice)
            $table->uuid('id')->primary();

            // drop_site_id is now a number
            $table->unsignedBigInteger('drop_site_id');

            // reporter user
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // report text
            $table->text('description');

            // optional report status
            $table->enum('status', ['pending', 'in_review', 'resolved', 'rejected'])
                ->default('pending');

            $table->timestamps();

            // Foreign key
            $table->foreign('drop_site_id')->references('id')->on('drop_sites')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drop_site_reports');
    }
};
