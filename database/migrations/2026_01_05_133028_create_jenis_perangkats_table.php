<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jenis_perangkats', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Contoh: "Modul Ajar", "Prota", "Promes"
            $table->timestamps();
        });

        // Seeder Data Awal (Bisa dipisah ke Seeder class)
        // DB::table('jenis_perangkats')->insert([
        //     ['nama' => 'Modul Ajar / RPP'],
        //     ['nama' => 'Program Tahunan (Prota)'],
        //     ['nama' => 'Program Semester (Promes)'],
        //     ['nama' => 'Silabus / ATP'],
        //     ['nama' => 'KKTP / KKM'],
        // ]);
    }

    public function down()
    {
        Schema::dropIfExists('jenis_perangkats');
    }
};
