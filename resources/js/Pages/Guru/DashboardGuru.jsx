import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Book, ClipboardCheck, ScanLine, FileText, ChevronRight, Calendar, Clock } from 'lucide-react';

export default function DashboardGuru({ auth }) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('id-ID', options);

    const menus = [
        {
            title: 'Jurnal Mengajar',
            desc: 'Catat materi & aktivitas kelas',
            icon: <Book className="w-6 h-6 sm:w-8 sm:h-8" />,
            link: route('guru.jurnal.index'),
            color: 'from-blue-500 to-indigo-600',
            bgIcon: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
            external: false
        },
        {
            title: 'Absensi Siswa',
            desc: 'Rekap kehadiran murid',
            icon: <ClipboardCheck className="w-6 h-6 sm:w-8 sm:h-8" />,
            link: route('guru.absensi.index'),
            color: 'from-teal-500 to-emerald-600',
            bgIcon: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300',
            external: false
        },
        {
            title: 'Scan Kehadiran',
            desc: 'Absen masuk/pulang guru',
            icon: <ScanLine className="w-6 h-6 sm:w-8 sm:h-8" />,
            link: route('guru.absensi-saya.index'),
            color: 'from-orange-500 to-red-600',
            bgIcon: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
            external: false
        },
        {
            title: 'Cetak Laporan',
            desc: 'Unduh PDF Jurnal/Absen',
            icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
            link: route('export.jurnal'),
            color: 'from-purple-500 to-pink-600',
            bgIcon: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
            external: true
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header="Dashboard Guru">
            <Head title="Dashboard Guru" />

            <div className="space-y-6 sm:space-y-8">
                {/* 1. WELCOME BANNER */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 p-5 sm:p-8 text-white shadow-xl">
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Halo, {auth.user.name}! 👋</h2>
                                <p className="mt-1 sm:mt-2 opacity-90 text-blue-100 text-sm sm:text-base">Selamat beraktivitas. Jangan lupa isi jurnal mengajar hari ini ya.</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl border border-white/10 flex items-center gap-2 sm:flex-col sm:min-w-[150px]">
                                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 sm:mb-1" />
                                <span className="text-xs sm:text-sm font-medium">{formattedDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-10 -top-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-32 w-32 sm:h-48 sm:w-48 rounded-full bg-blue-400/20 blur-2xl"></div>
                </div>

                {/* 2. MENU GRID - RESPONSIVE 2 KOLOM DI MOBILE */}
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-5 flex items-center gap-2">
                        <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-indigo-500 rounded-full inline-block"></span> Menu Utama
                    </h3>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {menus.map((menu, index) => {
                            const Component = menu.external ? 'a' : Link;
                            const props = menu.external ? { href: menu.link, target: '_blank' } : { href: menu.link };

                            return (
                                <Component
                                    key={index}
                                    {...props}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div>
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${menu.bgIcon} flex items-center justify-center mb-3 sm:mb-4 transition-transform group-hover:scale-110`}>
                                            {menu.icon}
                                        </div>
                                        <h4 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-1 leading-tight">{menu.title}</h4>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{menu.desc}</p>
                                    </div>
                                    <div className="mt-3 sm:mt-6 flex items-center text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                                        <span className="hidden sm:inline">{menu.external ? 'Download PDF' : 'Buka Menu'}</span>
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                    <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${menu.color} transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}></div>
                                </Component>
                            );
                        })}
                    </div>
                </div>

                {/* 3. INFO WIDGET (JAM MENGAJAR & REKAP) - RESPONSIVE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">

                    {/* WIDGET JAM MENGAJAR */}
                    <Link
                        href={route('guru.jadwal.index')}
                        className="group block rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 p-4 sm:p-6 border border-emerald-100 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-emerald-500 rounded-full text-white group-hover:scale-110 transition-transform flex-shrink-0">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white group-hover:text-emerald-600 transition-colors">Jam Mengajar</h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">Cek jadwal pelajaran Anda minggu ini.</p>
                            </div>
                            <ChevronRight className="text-gray-400 group-hover:text-emerald-500 flex-shrink-0 w-5 h-5" />
                        </div>
                    </Link>

                    {/* WIDGET REKAP */}
                    <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 p-4 sm:p-6 border border-orange-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-orange-500 rounded-full text-white flex-shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">Rekap Bulanan</h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">Lihat performa kehadiran siswa Anda.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
