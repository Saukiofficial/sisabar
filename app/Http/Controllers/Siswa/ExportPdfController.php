<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Siswa;

class ExportPdfController extends Controller
{
    /**
     * Cetak Kartu Pelajar Siswa yang sedang login
     */
    public function kartuPelajar()
    {
        $user = Auth::user();

        // Ambil data siswa milik user yang sedang login
        $siswa = Siswa::with('kelas')->where('user_id', $user->id)->firstOrFail();

        // Data yang akan dikirim ke View PDF
        $data = [
            'siswa' => $siswa,
            'user' => $user,
            'sekolah' => [
                'nama' => 'SMA SMART CLASS', // Ganti dengan nama sekolah Anda
                'alamat' => 'Jl. Pendidikan No. 1, Kota Belajar',
                'logo_path' => public_path('images/logo.png') // Pastikan ada logo dummy atau hapus jika error
            ]
        ];

        // Load View PDF
        // Pastikan file resources/views/pdf/kartu_pelajar.blade.php sudah dibuat
        $pdf = Pdf::loadView('pdf.kartu_pelajar', $data);

        // Set ukuran kertas ID Card (CR-80: 85.6mm x 54mm)
        // Dikonversi ke point (1 mm = 2.83465 pt) -> ~243pt x 153pt
        $pdf->setPaper([0, 0, 242.65, 153.07], 'landscape');

        // Render & Stream (Tampilkan di browser)
        return $pdf->stream('Kartu-Pelajar-' . $siswa->nis . '.pdf');
    }
}
