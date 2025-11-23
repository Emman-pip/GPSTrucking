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
        Schema::table('barangay_official_information', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->cascadeOnDelete();
        });

        Schema::table('residencies', function (Blueprint $table) {
            $table->dropForeign(['barangay_id']);
            $table->foreign('barangay_id')
                  ->references( 'id')
                  ->on('barangays')
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangay_and_residencies', function (Blueprint $table) {
            Schema::table('barangay_official_information', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->foreign('user_id')
                    ->references('id')
                    ->on('users');
            });

            Schema::table('residencies', function (Blueprint $table) {
                $table->dropForeign(['barangay_id']);
                $table->foreign('barangay_id')
                    ->references( 'id')
                    ->on('barangays');
            });
        });
    }
};
