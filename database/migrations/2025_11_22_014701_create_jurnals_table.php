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

    Schema::create('jurnals', function (Blueprint $table) {
        $table->id();

        $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');


        $table->foreignId('mapel_id')->constrained('mapels')->onDelete('cascade');
        $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');

        $table->date('tanggal');
        $table->text('materi');
        $table->text('catatan')->nullable();
        $table->string('dokumentasi')->nullable(); // Path file foto

        $table->timestamps();
    });
}
};
