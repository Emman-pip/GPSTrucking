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
        Schema::create('drop_sites', function (Blueprint $table) {
            $table->id();
            $table->json('coordinates');
            $table->json('image')->nullable();
            $table->string('description');
            $table->foreignId('barangay_id')->constrained('barangays', 'id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drop_sites');
    }
};
