import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, BookOpen, Activity, CheckCircle, Clock, GraduationCap } from 'lucide-react';

// PERBAIKAN: Menambahkan default value pada props untuk mencegah error "undefined" (Layar Putih)
export default function DashboardKepsek({ auth, stats = {}, recentJurnals = [] }) {

    // Safety Check: Memastikan variabel stats aman diakses meski datanya kosong
    const safeStats = {
        total_guru: stats?.total_guru || 0,
        total_siswa: stats?.total_siswa || 0,
        guru_hadir: stats?.guru_hadir || 0,
        jurnal_masuk: stats?.jurnal_masuk || 0
    };

    const statCards = [
        {
            title: 'Total Guru',
            value: safeStats.total_guru,
            icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
            color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
        },
        {
            title: 'Total Siswa',
            value: safeStats.total_siswa,
            icon: <GraduationCap className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
            color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
        },
        {
            title: 'Guru Hadir Hari Ini',
            value: safeStats.guru_hadir,
            icon: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />,
            color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
        },
        {
            title: 'Jurnal Masuk',
            value: safeStats.jurnal_masuk,
            icon: <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
            color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header="Dashboard Kepala Sekolah">
            <Head title="Dashboard Kepsek" />

            <div className="space-y-8">
                {/* 1. WELCOME BANNER */}
                <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold">Selamat Datang, Bapak/Ibu Kepala Sekolah!</h2>
                        <p className="opacity-90 mt-2 text-indigo-100">
                            Berikut adalah ringkasan aktivitas sekolah hari ini. Pantau kinerja guru dan siswa dengan mudah.
                        </p>
                    </div>
                    {/* Dekorasi Banner */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* 2. STATISTIK UTAMA */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border ${stat.color} shadow-sm bg-white dark:bg-gray-800 transition hover:-translate-y-1 duration-300`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 3. AKTIVITAS JURNAL TERBARU */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                Aktivitas Mengajar Terbaru
                            </h3>
                            <Link href={route('kepsek.jurnal')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentJurnals.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <BookOpen className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">Belum ada aktivitas mengajar hari ini.</p>
                                </div>
                            ) : (
                                recentJurnals.map((jurnal) => (
                                    <div key={jurnal.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shrink-0 text-sm border-2 border-white dark:border-gray-600 shadow-sm">
                                            {jurnal.guru?.user?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800 dark:text-gray-100 truncate">
                                                    {jurnal.guru?.user?.name}
                                                </h4>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 ml-2 whitespace-nowrap">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(jurnal.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                                                Mengajar <span className="font-semibold text-indigo-600 dark:text-indigo-400">{jurnal.mapel?.nama_mapel}</span>
                                                {' '}di kelas <span className="font-semibold text-indigo-600 dark:text-indigo-400">{jurnal.kelas?.nama_kelas}</span>
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 truncate max-w-full">
                                                    Materi: {jurnal.materi}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 4. MENU MONITORING CEPAT */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                            Menu Monitoring
                        </h3>
                        <div className="space-y-3">
                            <Link
                                href={route('kepsek.absensi')}
                                className="group flex items-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-800 transition-all"
                            >
                                <div className="p-2 bg-white dark:bg-blue-800 rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-blue-800 dark:text-blue-200">Rekap Kehadiran</h5>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">Cek absensi guru harian</p>
                                </div>
                            </Link>

                            <Link
                                href={route('kepsek.jurnal')}
                                className="group flex items-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-100 dark:border-purple-800 transition-all"
                            >
                                <div className="p-2 bg-white dark:bg-purple-800 rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-purple-800 dark:text-purple-200">Monitoring Jurnal</h5>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">Pantau KBM kelas</p>
                                </div>
                            </Link>

                            {/* LINK LAPORAN SISWA (AKTIF) */}
                            <Link
                                href={route('kepsek.laporan-siswa')}
                                className="group flex items-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-100 dark:border-orange-800 transition-all"
                            >
                                <div className="p-2 bg-white dark:bg-orange-800 rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-orange-800 dark:text-orange-200">Laporan Siswa</h5>
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Rekap Absensi Siswa</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
