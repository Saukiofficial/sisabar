<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // Menambahkan kolom user_id yang terhubung ke tabel users
            // Nullable dulu untuk data lama, tapi nanti wajib diisi
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
