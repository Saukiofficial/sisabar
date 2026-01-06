<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('perangkat_pembelajarans', function (Blueprint $table) {
            // Kolom JSON untuk menyimpan array checklist (item yang dicentang)
            $table->json('checklist')->nullable();
        });
    }

    public function down()
    {
        Schema::table('perangkat_pembelajarans', function (Blueprint $table) {
            $table->dropColumn('checklist');
        });
    }
};
