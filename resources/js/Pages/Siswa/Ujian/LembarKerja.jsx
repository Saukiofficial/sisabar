import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react'; // PERBAIKAN: Gunakan paket yang benar
import {
    Clock, ChevronLeft, ChevronRight, Save,
    CheckCircle, AlertTriangle, FileText, Menu, Home
} from 'lucide-react';
import axios from 'axios';

export default function LembarKerja({ auth, hasil, soals = [], saved_jawabans = {} }) {

    // --- SAFEGUARD: JIKA SOAL KOSONG ---
    // Mencegah blank screen jika guru lupa input soal atau data array kosong
    if (!soals || soals.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Soal Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-6">
                        Paket ujian ini belum memiliki butir soal. Silakan hubungi guru pengawas.
                    </p>
                    <button
                        onClick={() => router.visit(route('siswa.ujian.index'))}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full font-bold"
                    >
                        Kembali ke Jadwal
                    </button>
                </div>
            </div>
        );
    }

    // --- STATE ---
    const [currentNo, setCurrentNo] = useState(0);
    const [jawaban, setJawaban] = useState(saved_jawabans || {});
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState('Memuat...');

    // Ambil soal aktif dengan aman
    const currentSoal = soals[currentNo];

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (!hasil?.waktu_mulai || !hasil?.ujian?.durasi_menit) return;

        const startTime = new Date(hasil.waktu_mulai).getTime();
        const durationMs = hasil.ujian.durasi_menit * 60 * 1000;
        const endTime = startTime + durationMs;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft("WAKTU HABIS");
                // Opsional: Paksa selesai jika waktu habis (buka komen di bawah jika ingin auto-submit)
                // handleSelesai();
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [hasil]);

    // --- HANDLER SIMPAN JAWABAN ---
    const handleJawab = async (soalId, value) => {
        // Update State Lokal dulu biar cepat (Optimistic UI)
        setJawaban(prev => ({ ...prev, [soalId]: value }));

        try {
            // Simpan ke database via AJAX (Background)
            await axios.post(route('siswa.ujian.simpan', hasil.id), {
                soal_id: soalId,
                jawaban: value
            });
        } catch (error) {
            console.error("Gagal menyimpan jawaban", error);
        }
    };

    // --- NAVIGASI ---
    const nextSoal = () => {
        if (currentNo < soals.length - 1) setCurrentNo(currentNo + 1);
    };

    const prevSoal = () => {
        if (currentNo > 0) setCurrentNo(currentNo - 1);
    };

    // --- SELESAI UJIAN ---
    const handleSelesai = () => {
        const belumDijawab = soals.filter(s => !jawaban[s.id]).length;

        let confirmMsg = `Apakah Anda yakin ingin menyelesaikan ujian ini?`;
        if (belumDijawab > 0) {
            confirmMsg += `\n\nPERINGATAN: Masih ada ${belumDijawab} soal yang belum dijawab!`;
        }

        if (confirm(confirmMsg)) {
            router.post(route('siswa.ujian.selesai', hasil.id));
        }
    };

    // Pastikan currentSoal ada sebelum render UI utama (Double Check)
    if (!currentSoal) return <div className="p-8 text-center">Memuat Soal...</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col font-sans">
            <Head title={hasil?.ujian?.judul || 'Ujian'} />

            {/* --- HEADER --- */}
            <div className="bg-white dark:bg-gray-800 shadow-md h-16 fixed top-0 w-full z-50 px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-sm">
                        {currentNo + 1}
                    </div>
                    <div className="hidden sm:block overflow-hidden">
                        <h1 className="text-sm font-bold text-gray-800 dark:text-white uppercase truncate max-w-[200px] md:max-w-md">
                            {hasil?.ujian?.judul}
                        </h1>
                        <p className="text-xs text-gray-500 truncate">
                            {hasil?.ujian?.mapel?.nama_mapel}
                        </p>
                    </div>
                </div>

                {/* Timer & Menu Mobile */}
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-mono font-bold transition-colors ${
                        timeLeft === 'WAKTU HABIS'
                        ? 'bg-red-600 text-white border-red-600 animate-pulse'
                        : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                    }`}>
                        <Clock className="w-4 h-4" />
                        <span>{timeLeft}</span>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="pt-20 pb-24 px-4 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* --- KOLOM KIRI: SOAL (3/4) --- */}
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[60vh] flex flex-col relative overflow-hidden">

                        {/* Progress Bar Top */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${((currentNo + 1) / soals.length) * 100}%` }}
                            ></div>
                        </div>

                        {/* Header Soal */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {currentSoal.tipe}
                            </span>
                        </div>

                        {/* Isi Soal */}
                        <div className="p-6 flex-1 overflow-y-auto">
                            <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed font-serif">
                                {currentSoal.pertanyaan}
                            </p>
                        </div>

                        {/* Area Jawaban */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700">
                            {currentSoal.tipe === 'Pilihan Ganda' ? (
                                <div className="space-y-3">
                                    {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                                        currentSoal[`opsi_${opt}`] && (
                                            <label
                                                key={opt}
                                                className={`flex items-center p-3 md:p-4 rounded-lg border cursor-pointer transition-all group ${
                                                    jawaban[currentSoal.id] === opt.toUpperCase()
                                                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 dark:bg-blue-900/20 dark:border-blue-500'
                                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`soal_${currentSoal.id}`}
                                                    value={opt.toUpperCase()}
                                                    checked={jawaban[currentSoal.id] === opt.toUpperCase()}
                                                    onChange={() => handleJawab(currentSoal.id, opt.toUpperCase())}
                                                    className="hidden"
                                                />
                                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-sm md:text-base mr-4 transition-colors ${
                                                    jawaban[currentSoal.id] === opt.toUpperCase()
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                    {opt.toUpperCase()}
                                                </div>
                                                <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base flex-1">
                                                    {currentSoal[`opsi_${opt}`]}
                                                </span>
                                            </label>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="relative">
                                    <textarea
                                        rows="8"
                                        className="w-full rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm p-4"
                                        placeholder="Tulis jawaban uraian Anda di sini secara lengkap..."
                                        value={jawaban[currentSoal.id] || ''}
                                        onChange={(e) => handleJawab(currentSoal.id, e.target.value)}
                                    ></textarea>
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                                        Jawaban otomatis tersimpan
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigasi Bawah */}
                    <div className="flex justify-between mt-6 gap-4">
                        <button
                            onClick={prevSoal}
                            disabled={currentNo === 0}
                            className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" /> <span className="hidden sm:inline">Sebelumnya</span>
                        </button>

                        {currentNo === soals.length - 1 ? (
                            <button
                                onClick={handleSelesai}
                                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                            >
                                <Save className="w-5 h-5" /> Selesai & Kumpulkan
                            </button>
                        ) : (
                            <button
                                onClick={nextSoal}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 hover:translate-x-1 transition-all"
                            >
                                <span className="hidden sm:inline">Selanjutnya</span> <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* --- KOLOM KANAN: NAVIGASI NOMOR (SIDEBAR) --- */}
                <div
                    className={`fixed inset-0 z-40 md:static md:z-auto bg-black/50 md:bg-transparent transition-opacity duration-300 ${
                        sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'
                    }`}
                    onClick={() => setSidebarOpen(false)} // Tutup jika klik overlay
                >
                    <div
                        className={`fixed right-0 top-0 h-full w-3/4 max-w-xs md:static md:w-full md:h-auto bg-white dark:bg-gray-800 md:rounded-xl shadow-2xl md:shadow-sm border-l md:border border-gray-200 dark:border-gray-700 p-5 transform transition-transform duration-300 ease-out flex flex-col ${
                            sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
                        }`}
                        onClick={e => e.stopPropagation()} // Stop bubbling
                    >
                        <div className="flex justify-between items-center mb-6 md:hidden">
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg">Navigasi Soal</h3>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold border-b border-gray-100 dark:border-gray-700 pb-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <span>Daftar Soal ({soals.length})</span>
                        </div>

                        <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[calc(100vh-250px)] md:max-h-[60vh] pr-1 pb-4">
                            {soals.map((s, idx) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setCurrentNo(idx);
                                        setSidebarOpen(false);
                                    }}
                                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-bold border transition-all ${
                                        idx === currentNo
                                        ? 'ring-2 ring-blue-500 border-blue-500 z-10 scale-105 shadow-md'
                                        : 'border-transparent'
                                    } ${
                                        jawaban[s.id]
                                        ? 'bg-green-500 text-white border-green-600'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div> Dijawab
                                </div>
                                <span className="font-bold">{Object.keys(jawaban).length}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div> Kosong
                                </div>
                                <span className="font-bold">{soals.length - Object.keys(jawaban).length}</span>
                            </div>

                            <button
                                onClick={handleSelesai}
                                className="w-full mt-4 py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300 font-bold rounded-lg border border-red-100 dark:border-red-800 hover:bg-red-100 transition flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> Hentikan Ujian
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
