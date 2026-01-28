import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react'; // Library untuk render QR
import { Search, Printer, User, Users } from 'lucide-react';

export default function GenerateQr({ auth, siswas, gurus }) {
    const [activeTab, setActiveTab] = useState('siswa'); // 'siswa' atau 'guru'
    const [searchTerm, setSearchTerm] = useState('');

    // --- FILTER DATA ---
    const filteredSiswa = siswas.filter(s =>
        s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nis && s.nis.includes(searchTerm))
    );

    const filteredGuru = gurus.filter(g =>
        g.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.user.username && g.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
        // Hapus filter NIP jika kolomnya tidak ada
    );

    const dataToShow = activeTab === 'siswa' ? filteredSiswa : filteredGuru;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Generator QR Code</h2>}
        >
            <Head title="Buat QR Code" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* --- CONTROLS (TIDAK DICETAK) --- */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 no-print">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Tab Switcher */}
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('siswa')}
                                className={`flex-1 flex items-center gap-2 px-6 py-2 rounded-md font-medium text-sm transition ${
                                    activeTab === 'siswa'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                <Users size={16} /> Data Siswa
                            </button>
                            <button
                                onClick={() => setActiveTab('guru')}
                                className={`flex-1 flex items-center gap-2 px-6 py-2 rounded-md font-medium text-sm transition ${
                                    activeTab === 'guru'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                <User size={16} /> Data Guru
                            </button>
                        </div>

                        {/* Search & Print */}
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder={activeTab === 'siswa' ? "Cari Nama / NIS..." : "Cari Nama / Username..."}
                                    className="w-full pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-blue-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition font-bold text-sm"
                            >
                                <Printer size={16} /> Cetak Semua
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- GRID QR CODE --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 print:grid-cols-4 print:gap-4">
                    {dataToShow.length > 0 ? (
                        dataToShow.map((item, index) => (
                            <div key={index} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center text-center bg-white dark:bg-gray-800 break-inside-avoid shadow-sm print:shadow-none print:border-gray-400">
                                {/* Header Card */}
                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">
                                    {activeTab === 'siswa' ? 'KARTU SISWA' : 'KARTU GURU'}
                                </div>

                                {/* QR Code Box */}
                                <div className="bg-white p-2 rounded-lg mb-3 border border-gray-100">
                                    <QRCodeSVG
                                        // [LOGIKA PENTING]
                                        // Siswa: Gunakan NIS
                                        // Guru: Gunakan USERNAME (karena NIP tidak ada)
                                        value={activeTab === 'siswa'
                                            ? (item.nis || 'No NIS')
                                            : (item.user.username || 'No User')
                                        }
                                        size={100}
                                        level="H" // High Error Correction (lebih mudah discan meski agak rusak)
                                    />
                                </div>

                                {/* Nama User */}
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                                    {item.user.name}
                                </h3>

                                {/* Info Tambahan (NIS / Username) */}
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                    {activeTab === 'siswa'
                                        ? (item.nis || '-')
                                        : (item.user.username || '-')
                                    }
                                </p>

                                {/* Info Kelas (Khusus Siswa) */}
                                {activeTab === 'siswa' && (
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-2 border border-blue-100">
                                        {item.kelas?.nama_kelas || 'UMUM'}
                                    </span>
                                )}

                                {/* Info Mapel (Khusus Guru) */}
                                {activeTab === 'guru' && (
                                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mt-2 border border-purple-100">
                                        {item.mapel?.nama_mapel || 'PENGAJAR'}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data tidak ditemukan</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Coba kata kunci pencarian lain.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Khusus Print */}
            <style>{`
                @media print {
                    @page { margin: 1cm; size: A4 portrait; }
                    .no-print { display: none !important; }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    /* Pastikan elemen tidak terpotong antar halaman */
                    .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }

                    /* Sembunyikan elemen layout default (Sidebar/Header) jika ada class tertentu */
                    nav, aside, header { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
