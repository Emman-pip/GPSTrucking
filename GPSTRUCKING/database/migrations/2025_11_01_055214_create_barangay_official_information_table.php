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
        Schema::create('barangay_official_information', function (Blueprint $table) {
            $table->id();
            $table->string('barangay_official_id'); // path to image of official barangay id
            $table->foreignId('barangay_id')->constrained('barangays', 'id');
            $table->string('proof_of_identity'); // path to proof of identity
            $table->string('contact_number');
            $table->string('email');
            $table->foreignId('user_id')->constrained('users', 'id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_official_information');
    }
};
