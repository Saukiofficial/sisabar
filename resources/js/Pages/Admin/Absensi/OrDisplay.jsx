import React, { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import Swal from 'sweetalert2';

export default function OrDisplay() {
    // State
    const [scanResult, setScanResult] = useState(null); // Data siswa hasil scan
    const [scanStatus, setScanStatus] = useState('IDLE'); // IDLE, SUCCESS, ERROR
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isProcessing, setIsProcessing] = useState(false);

    // Refs untuk Audio
    const audioSuccess = useRef(null);
    const audioError = useRef(null);

    // --- 1. CLOCK LOGIC ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- 2. SCANNER LOGIC ---
    useEffect(() => {
        const onScanSuccess = (decodedText, decodedResult) => {
            if (isProcessing) return;
            // Cegah scan berulang terlalu cepat
            handleScan(decodedText);
        };

        const onScanFailure = (error) => {
            // console.warn(`Scan error = ${error}`);
        };

        // Inisialisasi Scanner
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            false
        );

        html5QrcodeScanner.render(onScanSuccess, onScanFailure);

        // Cleanup saat component unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, [isProcessing]);

    // --- 3. HANDLE API REQUEST ---
    const handleScan = async (qrCode) => {
        setIsProcessing(true);

        try {
            // Kirim data ke server
            const response = await axios.post(route('admin.absensi.store'), {
                qr_code: qrCode
            });

            const data = response.data;

            if (data.status === 'success') {
                // Mainkan Audio Sukses
                if (audioSuccess.current) {
                    audioSuccess.current.currentTime = 0;
                    audioSuccess.current.play();
                }

                // Set Data ke State
                setScanResult({
                    mode: data.mode, // 'MASUK' atau 'PULANG'
                    nama: data.siswa.nama,
                    kelas: data.siswa.kelas,
                    jam: data.siswa.jam,
                    pesan: data.message
                });
                setScanStatus('SUCCESS');

                // Reset tampilan setelah 4 detik
                setTimeout(() => {
                    setScanStatus('IDLE');
                    setScanResult(null);
                    setIsProcessing(false);
                }, 4000);

            } else {
                // Handle Warning (Misal: Sudah Absen)
                if (audioError.current) {
                    audioError.current.currentTime = 0;
                    audioError.current.play();
                }

                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: data.message,
                    timer: 2500,
                    showConfirmButton: false,
                    background: '#1f2937',
                    color: '#fff'
                });
                setIsProcessing(false);
            }

        } catch (error) {
            // Handle Error (Siswa/Guru tidak ditemukan)
            if (audioError.current) {
                audioError.current.currentTime = 0;
                audioError.current.play();
            }

            const errMsg = error.response?.data?.message || 'Terjadi Kesalahan Sistem';

            // [DEBUGGING] Tampilkan kode yang terbaca agar kita tahu apa isinya
            const scannedCode = error.response?.data?.debug_code || qrCode;

            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                // Tampilkan kode yang terbaca di pesan error
                html: `${errMsg}<br/><br/><small class="text-gray-400">Kode Terbaca: <b>${scannedCode}</b></small>`,
                timer: 4000,
                showConfirmButton: false,
                background: '#1f2937',
                color: '#fff'
            });
            setIsProcessing(false);
        }
    };

    // Helper Format Tanggal
    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="bg-black text-white h-screen w-screen overflow-hidden flex flex-col md:flex-row">
            <Head title="Gate Scanner" />

            {/* --- AUDIO ELEMENTS --- */}
            <audio ref={audioSuccess} src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3" />
            <audio ref={audioError} src="https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3" />

            {/* --- KIRI: KAMERA --- */}
            <div className="w-full md:w-2/3 relative border-b md:border-b-0 md:border-r border-gray-800 bg-gray-900 flex flex-col items-center justify-center p-4">
                {/* Header Overlay */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-500 tracking-wider font-mono">GATE SCANNER</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-xs text-gray-400">SYSTEM ONLINE</p>
                    </div>
                </div>

                {/* Camera Box */}
                <div className="relative w-full max-w-sm md:max-w-lg aspect-square bg-black border-4 border-gray-700 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                    <div id="reader" className="w-full h-full object-cover"></div>

                    {/* Visual Effect: Scanning Line */}
                    <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/30 z-20 rounded-xl"></div>
                    {!isProcessing && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_10px_#4ade80] z-10 animate-[scan_2s_infinite_linear]"></div>
                    )}
                </div>

                <p className={`mt-6 text-lg font-mono tracking-widest ${isProcessing ? 'text-yellow-400 animate-bounce' : 'text-gray-500 animate-pulse'}`}>
                    {isProcessing ? 'MEMPROSES DATA...' : 'ARAHKAN KARTU KE KAMERA'}
                </p>
            </div>

            {/* --- KANAN: INFORMASI --- */}
            <div className="w-full md:w-1/3 bg-gray-950 p-6 md:p-8 flex flex-col relative border-l border-gray-800 shadow-2xl">

                {/* Jam Digital */}
                <div className="text-center md:text-right border-b border-gray-800 pb-4 md:pb-6 mb-4 md:mb-6">
                    <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-widest">
                        {currentTime.toLocaleTimeString('id-ID', { hour12: false })}
                    </div>
                    <div className="text-gray-400 text-sm mt-2 font-mono uppercase">
                        {formatDate(currentTime)}
                    </div>
                </div>

                {/* KONTEN DINAMIS */}
                <div className="flex-1 flex flex-col items-center justify-center transition-all duration-300 min-h-[300px]">

                    {scanStatus === 'IDLE' && (
                        <div className="flex flex-col items-center text-gray-700 opacity-60">
                            <svg className="w-24 h-24 md:w-32 md:h-32 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                            </svg>
                            <p className="text-xl font-light">Menunggu Scan...</p>
                        </div>
                    )}

                    {scanStatus === 'SUCCESS' && scanResult && (
                        <div className="w-full flex flex-col items-center text-center animate-fade-in-up">
                            {/* Avatar */}
                            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full mb-6 p-1 bg-gradient-to-tr ${scanResult.mode === 'MASUK' ? 'from-green-400 to-blue-500' : 'from-orange-400 to-red-500'}`}>
                                <div className="w-full h-full rounded-full bg-gray-800 border-4 border-gray-900 overflow-hidden">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${scanResult.nama}&background=random&size=128`}
                                        alt="Siswa"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Nama & Info */}
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{scanResult.nama}</h2>
                            <p className="text-lg md:text-xl text-blue-400 mb-6 md:mb-8 font-mono">{scanResult.kelas}</p>

                            {/* Status Badge */}
                            <div className={`w-full p-4 md:p-6 rounded-2xl border mb-6 backdrop-blur-sm ${
                                scanResult.mode === 'MASUK'
                                ? 'bg-green-900/30 border-green-500/50 text-green-400'
                                : 'bg-orange-900/30 border-orange-500/50 text-orange-400'
                            }`}>
                                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-1">STATUS ABSENSI</p>
                                <h3 className="text-4xl md:text-5xl font-bold font-mono tracking-wider">{scanResult.mode}</h3>
                                <div className="mt-3 text-white font-mono text-lg bg-black/30 inline-block px-4 py-1 rounded-lg">
                                    {scanResult.jam}
                                </div>
                            </div>

                            <p className="text-gray-400 italic font-light">"{scanResult.pesan}"</p>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-gray-800 text-center">
                    <a href={route('admin.dashboard')} className="text-xs text-gray-600 hover:text-white transition uppercase tracking-widest">
                        Kembali ke Dashboard
                    </a>
                </div>
            </div>

            {/* Global Style untuk Animasi Scan */}
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
