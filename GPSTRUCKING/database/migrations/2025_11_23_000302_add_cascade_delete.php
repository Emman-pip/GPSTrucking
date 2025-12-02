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
            $table->dropForeign(['barangay_id']);
            $table->foreign('barangay_id')
                  ->references('id')
                  ->on('barangays')
                  ->cascadeOnDelete();
        });

        Schema::table('residencies', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')
                  ->references( 'id')
                  ->on('users')
                  ->cascadeOnDelete();
        });


        Schema::table('drop_sites', function (Blueprint $table) {
            $table->dropForeign(['barangay_id']);
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays')
                ->cascadeOnDelete();
        });


        Schema::table('pick_up_schedules', function (Blueprint $table) {
            $table->dropForeign(['barangay_id']);
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays')
                ->cascadeOnDelete();
        });


        Schema::table('routes', function (Blueprint $table) {
            $table->dropForeign(['barangay_id']);
            $table->dropForeign(['pickup_id']);
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays')
                ->cascadeOnDelete();
            $table->foreign('pickup_id')
                ->references('id')
                ->on('pick_up_schedules')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('barangay_official_information', function (Blueprint $table) {
            $table->dropForeign(['barangay_id']);
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays');
        });

        Schema::table('residencies', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
        });

        Schema::table('drop_sites', function (Blueprint $table) {
            $table->dropForeign(['barangay_id']);
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays');
        });

        Schema::table('pick_up_schedules', function (Blueprint $table) {
            $table->dropForeign(['barangay_id']);
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays');
        });

        Schema::table('routes', function (Blueprint $table) {
            $table->dropForeign(['barangay_id', 'pickup_id']);
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays');
            $table->foreign('pickup_id')
                ->references('id')
                ->on('pick_up_schedules');
        });
    }
};
