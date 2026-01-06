<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\AbsensiGuru;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Inertia\Inertia;
use Carbon\Carbon;

class AbsensiGuruController extends Controller
{
    public function index()
    {
        $guru = Guru::where('user_id', Auth::id())->first();
        if (!$guru) return redirect()->route('dashboard');

        $histories = AbsensiGuru::where('guru_id', $guru->id)->latest()->limit(30)->get();

        return Inertia::render('Guru/AbsensiSaya/Index', [
            'histories' => $histories
        ]);
    }

    public function generateQr()
    {
        // FIX 1: Paksa Timezone Asia/Jakarta agar sinkron dengan jam dinding
        $today = Carbon::now('Asia/Jakarta');

        $token = 'ABSEN-' . $today->format('Y-m-d') . '-SEKOLAH-ID';
        $qrCode = (string) QrCode::size(300)->generate($token);

        return Inertia::render('Admin/Absensi/QrDisplay', [
            'qrCode' => $qrCode,
            'date' => $today->translatedFormat('l, d F Y')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['qr_token' => 'required']);

        $inputToken = trim($request->qr_token);

        // FIX 2: Generate token pembanding juga menggunakan Asia/Jakarta
        $today = Carbon::now('Asia/Jakarta');
        $validToken = 'ABSEN-' . $today->format('Y-m-d') . '-SEKOLAH-ID';

        // DEBUG: Jika token beda, kirim pesan error detail menggunakan 'error' flash
        if ($inputToken !== $validToken) {
            return redirect()->back()->with('error', "QR Invalid! Server minta: '$validToken', tapi Scan: '$inputToken'");
        }

        // --- PROSES ABSENSI ---
        $guru = Guru::where('user_id', Auth::id())->first();
        if(!$guru) return redirect()->back()->with('error', 'Data guru tidak ditemukan');

        $dateString = $today->format('Y-m-d');
        $timeString = $today->format('H:i:s');

        $absen = AbsensiGuru::where('guru_id', $guru->id)->where('tanggal', $dateString)->first();

        if (!$absen) {
            AbsensiGuru::create([
                'guru_id' => $guru->id,
                'tanggal' => $dateString,
                'jam_masuk' => $timeString,
                'lokasi' => $request->lokasi,
                'device_info' => $request->device_info
            ]);
            $message = 'Berhasil Check-in!';
        } else {
            if ($absen->jam_pulang == null) {
                $absen->update(['jam_pulang' => $timeString]);
                $message = 'Berhasil Check-out!';
            } else {
                $message = 'Anda sudah melengkapi absensi hari ini.';
            }
        }

        return redirect()->back()->with('message', $message);
    }
}
