import React from 'react';
// Menggunakan relative path untuk menghindari error build
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Award, BookOpen, Calendar, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

export default function NilaiIndex({ auth, riwayats }) {

    // Helper untuk format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper untuk menentukan status kelulusan (Contoh KKM 75)
    const isLulus = (nilai) => parseFloat(nilai) >= 75;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Riwayat Nilai & Hasil Belajar</h2>}
        >
            <Head title="Riwayat Nilai" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* --- STATISTIK SINGKAT (Optional) --- */}
                {riwayats.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><BarChart3 size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500">Total Ujian</p>
                                <p className="text-xl font-bold dark:text-white">{riwayats.length}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full"><CheckCircle size={24} /></div>
                            <div>
                                <p className="text-sm text-gray-500">Rata-rata Nilai</p>
                                <p className="text-xl font-bold dark:text-white">
                                    {(riwayats.reduce((a, b) => a + parseFloat(b.nilai_akhir), 0) / riwayats.length).toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- DAFTAR NILAI --- */}
                {riwayats.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Belum ada riwayat nilai</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Anda belum menyelesaikan ujian apapun. Kerjakan ujian di menu Jadwal Ulangan.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {riwayats.map((riwayat) => (
                            <div key={riwayat.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className={`text-3xl font-extrabold ${isLulus(riwayat.nilai_akhir) ? 'text-green-600' : 'text-red-500'}`}>
                                            {Number(riwayat.nilai_akhir)}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2" title={riwayat.ujian.judul}>
                                        {riwayat.ujian.judul}
                                    </h3>
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">
                                        {riwayat.ujian.mapel.nama_mapel}
                                    </p>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                        <Calendar className="w-3 h-3" />
                                        <span>Dikerjakan: {formatDate(riwayat.created_at)}</span>
                                    </div>
                                </div>

                                <div className={`px-6 py-3 border-t flex justify-between items-center text-sm font-medium ${isLulus(riwayat.nilai_akhir) ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'}`}>
                                    <span>Status:</span>
                                    <span className="flex items-center gap-1">
                                        {isLulus(riwayat.nilai_akhir) ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" /> Tuntas
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4" /> Belum Tuntas
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
