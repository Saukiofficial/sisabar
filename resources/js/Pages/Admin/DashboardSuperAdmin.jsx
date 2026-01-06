import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, BookOpen, Building, QrCode, FileText, GraduationCap, ChevronRight, Activity, Calendar } from 'lucide-react';

export default function DashboardSuperAdmin({ auth, stats }) {
    // Konfigurasi Kartu Statistik
    const statCards = [
        {
            title: 'Total Guru',
            value: stats.total_guru,
            icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800'
        },
        {
            title: 'Total Siswa',
            value: stats.total_siswa,
            icon: <GraduationCap className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            border: 'border-orange-200 dark:border-orange-800'
        },
        {
            title: 'Total Kelas',
            value: stats.total_kelas,
            icon: <Building className="w-6 h-6 text-green-600 dark:text-green-400" />,
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800'
        },
        {
            title: 'Jurnal Hari Ini',
            value: stats.jurnal_hari_ini,
            icon: <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-200 dark:border-purple-800'
        },
    ];

    // Konfigurasi Menu Akses Cepat
    const menus = [
        {
            title: 'Data Guru',
            desc: 'Manajemen akun & profil guru',
            icon: <Users />,
            link: route('gurus.index'),
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Data Siswa',
            desc: 'Manajemen siswa & kelas',
            icon: <GraduationCap />,
            link: route('siswas.index'),
            color: 'from-orange-500 to-orange-600'
        },
        {
            title: 'Data Kelas',
            desc: 'Atur kelas & wali kelas',
            icon: <Building />,
            link: route('kelas.index'),
            color: 'from-green-500 to-green-600'
        },

        // MENU JADWAL PELAJARAN (BARU)
        {
            title: 'Jadwal Pelajaran',
            desc: 'Atur jam mengajar guru',
            icon: <Calendar />,
            link: route('jadwals.index'),
            color: 'from-teal-500 to-teal-600'
        },

        {
            title: 'Mata Pelajaran',
            desc: 'Daftar mapel sekolah',
            icon: <BookOpen />,
            link: route('mapels.index'),
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Layar QR Absen',
            desc: 'Mode Kiosk untuk absensi',
            icon: <QrCode />,
            link: route('admin.qr.generate'),
            color: 'from-red-500 to-red-600'
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header="Admin Dashboard">
            <Head title="Dashboard Admin" />

            <div className="space-y-8">
                {/* 1. WELCOME BANNER */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold">Selamat Datang, Administrator!</h2>
                        <p className="opacity-90 mt-2 text-blue-100">
                            Sistem siap digunakan. Pantau aktivitas sekolah hari ini dengan mudah.
                        </p>
                    </div>
                    {/* Dekorasi Banner */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* 2. STAT CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl border ${stat.bg} ${stat.border} shadow-sm dark:shadow-none transition hover:-translate-y-1 duration-300`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. QUICK ACCESS MENU */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Akses Cepat
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menus.map((menu, idx) => (
                            <Link
                                key={idx}
                                href={menu.link}
                                className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Background Decoration Icon */}
                                <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${menu.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500 blur-xl`}></div>

                                <div className="flex items-start gap-5 relative z-10">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${menu.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                                        {menu.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {menu.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {menu.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow Indicator */}
                                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
