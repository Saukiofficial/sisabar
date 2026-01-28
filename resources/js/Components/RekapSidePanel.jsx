import React from 'react';
import { X, CheckCircle, Clock, XCircle, FileText, User } from 'lucide-react';

export default function RekapSidePanel({ isOpen, onClose, data, isLoading }) {
    if (!isOpen) return null;

    // Helper warna status
    const getStatusColor = (status) => {
        switch(status) {
            case 'Hadir': return 'text-green-600 bg-green-100 border-green-200';
            case 'Terlambat': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            case 'Sakit': return 'text-purple-600 bg-purple-100 border-purple-200';
            case 'Izin': return 'text-blue-600 bg-blue-100 border-blue-200';
            default: return 'text-red-600 bg-red-100 border-red-200';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop Gelap */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Panel Samping (Slide Over) */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out border-l dark:border-gray-700">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Rekap Absensi</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500">Memuat data...</p>
                    </div>
                ) : data ? (
                    <div className="space-y-6 animate-fade-in">

                        {/* Profil Siswa */}
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-2xl">
                                {data.siswa.nama.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{data.siswa.nama}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{data.siswa.nis}</p>
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded mt-1 inline-block">
                                    {data.siswa.kelas?.nama_kelas}
                                </span>
                            </div>
                        </div>

                        {/* Statistik Semester */}
                        <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex justify-between items-center">
                                Statistik Semester
                                <span className="text-xs font-normal bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                                    {data.semester}
                                </span>
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1 text-green-700 dark:text-green-400">
                                        <CheckCircle size={16} /> <span className="text-xs font-bold uppercase">Hadir</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">{data.rekap.Hadir}</p>
                                </div>
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1 text-yellow-700 dark:text-yellow-400">
                                        <Clock size={16} /> <span className="text-xs font-bold uppercase">Terlambat</span>
                                    </div>
                                    <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{data.rekap.Terlambat}</p>
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1 text-purple-700 dark:text-purple-400">
                                        <FileText size={16} /> <span className="text-xs font-bold uppercase">Sakit/Izin</span>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                                        {data.rekap.Sakit + data.rekap.Izin}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1 text-red-700 dark:text-red-400">
                                        <XCircle size={16} /> <span className="text-xs font-bold uppercase">Alpha</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-800 dark:text-red-300">{data.rekap.Alpha}</p>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Terakhir */}
                        <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">5 Kehadiran Terakhir</h4>
                            <div className="space-y-2">
                                {data.riwayat.length > 0 ? (
                                    data.riwayat.map((log, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    {new Date(log.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                                                </p>
                                                <p className="text-xs text-gray-500 font-mono">
                                                    Masuk: {log.waktu_masuk || '-'}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded border font-bold ${getStatusColor(log.status)}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">Belum ada data kehadiran.</p>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-10">Data tidak ditemukan</div>
                )}
            </div>
        </div>
    );
}
