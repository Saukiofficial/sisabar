import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { GraduationCap, Clock, AlertCircle, CheckCircle, Calendar, User } from 'lucide-react';

export default function DashboardSiswa({ auth, siswa, stats, tanggal_hari_ini }) {

    // Helper untuk kartu statistik
    const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
        <div className={`p-4 rounded-xl shadow-sm border ${bgClass} border-opacity-50 flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
                <Icon size={24} className={colorClass} />
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Dashboard Siswa</h2>}
        >
            <Head title="Dashboard Siswa" />

            <div className="py-2">

                {/* 1. WELCOME BANNER */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-1">Halo, {siswa?.nama || auth.user.name}! 👋</h3>
                        <p className="text-blue-100 opacity-90">
                            Selamat datang di Smart Class System. Jangan lupa cek jadwal ujian ya!
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm text-sm">
                            <Calendar size={16} />
                            <span>{tanggal_hari_ini}</span>
                        </div>
                    </div>
                    {/* Hiasan Background */}
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                        <GraduationCap size={180} />
                    </div>
                </div>

                {/* 2. STATISTIK KEHADIRAN (Dari Scan Gerbang) */}
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <Clock className="text-blue-500" />
                        Statistik Kehadiran Bulan Ini
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            title="Hadir"
                            value={stats?.hadir || 0}
                            icon={CheckCircle}
                            colorClass="text-green-600"
                            bgClass="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        />
                        <StatCard
                            title="Terlambat"
                            value={stats?.terlambat || 0}
                            icon={Clock}
                            colorClass="text-yellow-600"
                            bgClass="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                        />
                        <StatCard
                            title="Alpha/Bolos"
                            value={stats?.alpha || 0}
                            icon={XCircle}
                            colorClass="text-red-600"
                            bgClass="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        />
                        <StatCard
                            title="Persentase"
                            value={`${stats?.persentase_kehadiran || 0}%`}
                            icon={GraduationCap}
                            colorClass="text-blue-600"
                            bgClass="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        />
                    </div>
                </div>

                {/* 3. INFO SISWA & KELAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kartu Identitas */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">
                            Identitas Saya
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                    {auth.user.avatar ? (
                                        <img src={`/storage/${auth.user.avatar}`} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                                    <p className="font-semibold text-gray-800 dark:text-white">{siswa?.nama}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">NIS / Username</p>
                                <p className="font-mono font-semibold text-gray-800 dark:text-white">{siswa?.nis}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Kelas</p>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                    {siswa?.kelas?.nama_kelas || 'Belum Masuk Kelas'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pengumuman / Info Dummy */}
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-100 dark:border-gray-700">
                            Informasi Sekolah
                        </h4>
                        <div className="space-y-4">
                            <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h5 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Absensi Digital Aktif</h5>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        Jangan lupa melakukan scan QR Code di gerbang saat datang dan pulang sekolah untuk mencatat kehadiran.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                <Calendar className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h5 className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">Persiapan Ujian Akhir</h5>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                        Pastikan kartu pelajar Anda siap dan NIS terdaftar untuk mengikuti ujian berbasis komputer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

// Icon Import Helper (Agar tidak error XCircle undefined)
import { XCircle } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
