import React from 'react';
// Menggunakan relative path untuk menghindari error build
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Clock, Calendar, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

export default function UjianIndex({ auth, jadwals }) {

    // Helper untuk menampilkan label status yang informatif
    const getStatusLabel = (jadwal) => {
        const now = new Date();
        const start = new Date(jadwal.waktu_mulai);
        const end = new Date(jadwal.waktu_selesai);

        // Jika siswa sudah mengerjakan dan statusnya selesai di database
        if (jadwal.status_pengerjaan === 'Selesai') {
            return (
                <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs border border-green-200">
                    <CheckCircle className="w-3 h-3" /> Selesai
                </span>
            );
        }

        // Cek waktu
        if (now < start) {
            return <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">Belum Mulai</span>;
        }
        if (now > end) {
            return <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-medium border border-red-100">Terlewat</span>;
        }

        // Jika sedang berlangsung
        return (
            <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-xs border border-blue-200 animate-pulse">
                <Clock className="w-3 h-3" /> Berlangsung
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Jadwal Ulangan</h2>}
        >
            <Head title="Jadwal Ulangan" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="grid gap-4">
                    {jadwals.length === 0 ? (
                        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada jadwal ujian</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Saat ini belum ada ujian yang dijadwalkan untuk kelas Anda.
                            </p>
                        </div>
                    ) : (
                        jadwals.map((jadwal) => (
                            <div key={jadwal.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                            {jadwal.ujian.mapel.nama_mapel}
                                        </span>
                                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
                                            {jadwal.ujian.jenis_soal}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {jadwal.nama_ujian}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Guru: <span className="font-medium">{jadwal.guru.user.name}</span>
                                    </p>

                                    {/* Info Waktu */}
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            {new Date(jadwal.waktu_mulai).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="hidden sm:inline text-gray-300">|</span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            {new Date(jadwal.waktu_mulai).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} -
                                            {new Date(jadwal.waktu_selesai).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                                        </span>
                                        <span className="hidden sm:inline text-gray-300">|</span>
                                        <span className="flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4 text-purple-500" />
                                            Durasi: <strong>{jadwal.durasi_menit} Menit</strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-3 min-w-[160px] w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-gray-700 pt-4 md:pt-0">
                                    <div className="text-sm font-medium">{getStatusLabel(jadwal)}</div>

                                    {/* Tombol Kerjakan: Muncul jika Waktu PAS & Belum Selesai */}
                                    {new Date() >= new Date(jadwal.waktu_mulai) &&
                                     new Date() <= new Date(jadwal.waktu_selesai) &&
                                     jadwal.status_pengerjaan !== 'Selesai' && (
                                        <Link
                                            href={route('siswa.ujian.persiapan', jadwal.id)}
                                            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
                                        >
                                            Kerjakan <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}

                                    {/* Tombol Lihat Nilai: Muncul jika sudah selesai */}
                                    {jadwal.status_pengerjaan === 'Selesai' && (
                                        <Link
                                            href={route('siswa.nilai.index')}
                                            className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm flex items-center justify-center shadow-sm"
                                        >
                                            Lihat Hasil
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
