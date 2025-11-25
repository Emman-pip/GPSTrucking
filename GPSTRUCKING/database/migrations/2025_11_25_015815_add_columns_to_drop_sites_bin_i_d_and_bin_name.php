<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('drop_sites', function (Blueprint $table) {
            $table->string('bin_name')->default('unnamed site');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('drop_sites', function (Blueprint $table) {
            $table->dropColumn('bin_name');
        });
    }
};
