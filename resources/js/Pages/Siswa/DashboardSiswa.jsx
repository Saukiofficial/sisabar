import React from 'react';
// Menggunakan relative path untuk menghindari error build pada environment ini
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ClipboardList, Award, BookOpen, Clock, ArrowRight } from 'lucide-react';

export default function DashboardSiswa({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard Siswa</h2>}
        >
            <Head title="Dashboard Siswa" />

            <div className="py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- WELCOME BANNER --- */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Halo, {auth.user.name}! 👋</h1>
                        <p className="text-blue-100 text-base sm:text-lg max-w-xl">
                            Selamat datang di panel belajar. Siapkan dirimu untuk ujian hari ini atau cek hasil belajarmu sebelumnya.
                        </p>
                    </div>
                    {/* Hiasan Background */}
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                        <BookOpen size={150} className="sm:w-[200px] sm:h-[200px]" />
                    </div>
                </div>

                {/* --- MENU GRID --- */}
                {/* Mobile: 2 kolom, Tablet: 2 kolom, Desktop: 3 kolom */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">

                    {/* CARD 1: JADWAL ULANGAN */}
                    <Link
                        href={route('siswa.ujian.index')}
                        className="group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Calendar size={60} className="sm:w-[100px] sm:h-[100px] text-blue-600 dark:text-blue-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                                <Calendar size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Jadwal Ulangan</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                                Cek jadwal ujian harian, UTS, dan UAS yang akan datang.
                            </p>
                            <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm group-hover:translate-x-2 transition-transform">
                                Lihat Jadwal <ArrowRight size={14} className="sm:w-4 sm:h-4 ml-1" />
                            </span>
                        </div>
                    </Link>

                    {/* CARD 2: LATIHAN / KERJAKAN SOAL */}
                    <Link
                        href={route('siswa.ujian.index')} // Mengarah ke index ujian untuk memilih soal
                        className="group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ClipboardList size={60} className="sm:w-[100px] sm:h-[100px] text-orange-600 dark:text-orange-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                                <ClipboardList size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Latihan & Ujian</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                                Masuk ke ruang ujian, kerjakan soal latihan atau ujian sekolah.
                            </p>
                            <span className="inline-flex items-center text-orange-600 dark:text-orange-400 font-semibold text-xs sm:text-sm group-hover:translate-x-2 transition-transform">
                                Mulai Mengerjakan <ArrowRight size={14} className="sm:w-4 sm:h-4 ml-1" />
                            </span>
                        </div>
                    </Link>

                    {/* CARD 3: RIWAYAT NILAI */}
                    <Link
                        href={route('siswa.nilai.index')}
                        className="group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 relative overflow-hidden col-span-2 lg:col-span-1"
                    >
                        <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Award size={60} className="sm:w-[100px] sm:h-[100px] text-green-600 dark:text-green-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                                <Award size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Riwayat Nilai</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                                Lihat hasil pengerjaan soal dan evaluasi nilai-nilaimu.
                            </p>
                            <span className="inline-flex items-center text-green-600 dark:text-green-400 font-semibold text-xs sm:text-sm group-hover:translate-x-2 transition-transform">
                                Lihat Hasil <ArrowRight size={14} className="sm:w-4 sm:h-4 ml-1" />
                            </span>
                        </div>
                    </Link>

                </div>

                {/* --- INFO TAMBAHAN / WIDGET --- */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" /> Tips Ujian
                        </h4>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>Pastikan koneksi internet stabil sebelum memulai ujian.</li>
                            <li>Perhatikan durasi waktu yang tersedia.</li>
                            <li>Jangan lupa berdoa sebelum mengerjakan soal.</li>
                            <li>Jika terjadi kendala, segera hubungi Guru atau Pengawas.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
