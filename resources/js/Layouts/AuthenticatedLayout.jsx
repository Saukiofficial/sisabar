import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import {
    Home, Book, BookOpen, ClipboardCheck, ScanLine, User, Settings,
    Menu, X, Moon, Sun, LogOut, FileText, Building, Users,
    Activity, GraduationCap, List, Edit, Calendar, CheckCircle, MoreHorizontal
} from 'lucide-react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Ambil data roles dari props Inertia dengan aman
    const { props } = usePage();
    const roles = props.auth?.roles || user?.roles || [];

    // --- LOGIC DARK MODE ---
    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // --- LOGIC ROLE DETECTOR ---
    const isAdmin = roles.includes('Super Admin');
    const isGuru = roles.includes('Guru');
    const isKepsek = roles.includes('Kepala Sekolah');
    const isSiswa = roles.includes('Siswa');

    // Helper untuk cek route aman
    const safeRoute = (name) => {
        try { return route(name); } catch (e) { return '#'; }
    };

    // Helper untuk cek active state
    const isActive = (pattern) => {
        try { return route().current(pattern); } catch (e) { return false; }
    };

    // --- KONFIGURASI MENU SIDEBAR ---
    const menus = [
        // =================================================================
        // MENU GURU
        // =================================================================
        {
            show: isGuru,
            title: 'Dashboard',
            icon: <Home size={20} />,
            href: safeRoute('guru.dashboard'),
            active: isActive('guru.dashboard'),
            inBottomNav: true
        },
        {
            show: isGuru,
            title: 'Jurnal Mengajar',
            icon: <Book size={20} />,
            href: safeRoute('guru.jurnal.index'),
            active: isActive('guru.jurnal.*'),
            inBottomNav: true
        },
        {
            show: isGuru,
            title: 'Absensi Siswa',
            icon: <ClipboardCheck size={20} />,
            href: safeRoute('guru.absensi.index'),
            active: isActive('guru.absensi.*'),
            inBottomNav: true
        },
        {
            show: isGuru,
            title: 'Scan Kehadiran',
            icon: <ScanLine size={20} />,
            href: safeRoute('guru.absensi-saya.index'),
            active: isActive('guru.absensi-saya.*'),
            inBottomNav: false
        },
        {
            show: isGuru,
            title: 'Jadwal Saya',
            icon: <Activity size={20} />,
            href: safeRoute('guru.jadwal.index'),
            active: isActive('guru.jadwal.index'),
            inBottomNav: true
        },
        {
            show: isGuru,
            title: 'Perangkat Ajar',
            icon: <FileText size={20} />,
            href: safeRoute('guru.perangkat.index'),
            active: isActive('guru.perangkat.*'),
            inBottomNav: false
        },
        {
            show: isGuru,
            title: 'Bank Soal',
            icon: <List size={20} />,
            href: safeRoute('guru.bank-soal.index'),
            active: isActive('guru.bank-soal.*'),
            inBottomNav: false
        },
        {
            show: isGuru,
            title: 'Manajemen Ujian',
            icon: <Edit size={20} />,
            href: safeRoute('guru.ujian.index'),
            active: isActive('guru.ujian.*'),
            inBottomNav: false
        },
        {
            show: isGuru,
            title: 'Jadwal Ulangan',
            icon: <Calendar size={20} />,
            href: safeRoute('guru.ulangan.index'),
            active: isActive('guru.ulangan.*'),
            inBottomNav: false
        },

        // =================================================================
        // MENU SUPER ADMIN
        // =================================================================
        {
            show: isAdmin,
            title: 'Dashboard',
            icon: <Home size={20} />,
            href: safeRoute('admin.dashboard'),
            active: isActive('admin.dashboard'),
            inBottomNav: true
        },
        {
            show: isAdmin,
            title: 'Data Guru',
            icon: <Users size={20} />,
            href: safeRoute('gurus.index'),
            active: isActive('gurus.*'),
            inBottomNav: true
        },
        {
            show: isAdmin,
            title: 'Data Siswa',
            icon: <GraduationCap size={20} />,
            href: safeRoute('siswas.index'),
            active: isActive('siswas.*'),
            inBottomNav: true
        },
        {
            show: isAdmin,
            title: 'Data Kelas',
            icon: <Building size={20} />,
            href: safeRoute('kelas.index'),
            active: isActive('kelas.*'),
            inBottomNav: false
        },
        {
            show: isAdmin,
            title: 'Jadwal Pelajaran',
            icon: <Activity size={20} />,
            href: safeRoute('jadwals.index'),
            active: isActive('jadwals.*'),
            inBottomNav: true
        },
        {
            show: isAdmin,
            title: 'Mata Pelajaran',
            icon: <Book size={20} />,
            href: safeRoute('mapels.index'),
            active: isActive('mapels.*'),
            inBottomNav: false
        },
        {
            show: isAdmin,
            title: 'Bank Soal Guru',
            icon: <BookOpen size={20} />,
            href: safeRoute('admin.bank-soal.index'),
            active: isActive('admin.bank-soal.*'),
            inBottomNav: false
        },
        {
            show: isAdmin,
            title: 'Monitoring Perangkat',
            icon: <FileText size={20} />,
            href: safeRoute('admin.perangkat.index'),
            active: isActive('admin.perangkat.*'),
            inBottomNav: false
        },
        {
            show: isAdmin,
            title: 'QR Display',
            icon: <ScanLine size={20} />,
            href: safeRoute('admin.qr.generate'),
            active: isActive('admin.qr.generate'),
            inBottomNav: false
        },

        // =================================================================
        // MENU KEPALA SEKOLAH
        // =================================================================
        {
            show: isKepsek,
            title: 'Dashboard',
            icon: <Home size={20} />,
            href: safeRoute('kepsek.dashboard'),
            active: isActive('kepsek.dashboard'),
            inBottomNav: true
        },
        {
            show: isKepsek,
            title: 'Supervisi Perangkat',
            icon: <CheckCircle size={20} />,
            href: safeRoute('kepsek.supervisi.index'),
            active: isActive('kepsek.supervisi.*'),
            inBottomNav: true
        },
        {
            show: isKepsek,
            title: 'Monitoring Jurnal',
            icon: <BookOpen size={20} />,
            href: safeRoute('kepsek.jurnal'),
            active: isActive('kepsek.jurnal'),
            inBottomNav: true
        },
        {
            show: isKepsek,
            title: 'Rekap Kehadiran',
            icon: <ClipboardCheck size={20} />,
            href: safeRoute('kepsek.absensi'),
            active: isActive('kepsek.absensi'),
            inBottomNav: true
        },
        {
            show: isKepsek,
            title: 'Laporan Siswa',
            icon: <GraduationCap size={20} />,
            href: safeRoute('kepsek.laporan-siswa'),
            active: isActive('kepsek.laporan-siswa'),
            inBottomNav: false
        },

        // =================================================================
        // MENU SISWA
        // =================================================================
        {
            show: isSiswa,
            title: 'Dashboard',
            icon: <Home size={20} />,
            href: safeRoute('siswa.dashboard'),
            active: isActive('siswa.dashboard'),
            inBottomNav: true
        },
        {
            show: isSiswa,
            title: 'Jadwal Ulangan',
            icon: <Calendar size={20} />,
            href: safeRoute('siswa.ujian.index'),
            active: isActive('siswa.ujian.*'),
            inBottomNav: true
        },
        {
            show: isSiswa,
            title: 'Lihat Nilai',
            icon: <GraduationCap size={20} />,
            href: safeRoute('siswa.nilai.index'),
            active: isActive('siswa.nilai.*'),
            inBottomNav: true
        },
    ];

    // Filter menu yang ditampilkan
    const visibleMenus = menus.filter(m => m.show);
    const bottomNavMenus = visibleMenus.filter(m => m.inBottomNav).slice(0, 4);
    const moreMenus = visibleMenus.filter(m => !m.inBottomNav);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

            {/* --- SIDEBAR (DESKTOP ONLY) --- */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 z-50 transition-colors duration-300">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 bg-brand-50 dark:bg-gray-900/50">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-brand-600 dark:text-white" />
                    </Link>
                    <span className="ml-2 font-bold text-lg text-gray-800 dark:text-white">SI SABAR</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <nav className="px-4 space-y-1">
                        {visibleMenus.map((menu, index) => (
                            <Link
                                key={index}
                                href={menu.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 mb-1 group ${
                                    menu.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className={menu.active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}>
                                    {menu.icon}
                                </span>
                                <span className="ml-3 font-medium text-sm">{menu.title}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tampilan</span>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 transition"
                            title="Ganti Tema"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                    <Link
                        href={safeRoute('logout')} method="post" as="button"
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                        <LogOut size={18} />
                        <span className="ml-3">Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">

                {/* TOP BAR */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shadow-sm">

                    {/* Mobile Logo */}
                    <div className="md:hidden flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-blue-600 dark:text-white" />
                        </Link>
                        <span className="ml-2 font-bold text-base text-gray-800 dark:text-white">SI SABAR</span>
                    </div>

                    {/* Page Title (Desktop) */}
                    <div className="hidden md:block">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {header || 'Dashboard'}
                        </h1>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle (Mobile Only) */}
                        <button onClick={toggleDarkMode} className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* User Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-white focus:outline-none transition ease-in-out duration-150">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                                                {user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <span className="hidden sm:block">{user?.name}</span>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={safeRoute('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={safeRoute('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </nav>

                {/* CONTENT AREA */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
                    {children}
                </main>
            </div>

            {/* --- BOTTOM NAVIGATION BAR (MOBILE ONLY) --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {bottomNavMenus.map((menu, index) => (
                        <Link
                            key={index}
                            href={menu.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                                menu.active
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
                            }`}
                        >
                            {menu.active ? (
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl">
                                    {menu.icon}
                                </div>
                            ) : (
                                menu.icon
                            )}
                            <span className="text-[10px] font-medium truncate max-w-[60px]">
                                {menu.title.split(' ')[0]}
                            </span>
                        </Link>
                    ))}

                    {/* More Menu Button */}
                    {moreMenus.length > 0 && (
                        <button
                            onClick={() => setShowMobileMenu(true)}
                            className="flex flex-col items-center justify-center flex-1 h-full space-y-1 text-gray-500 dark:text-gray-400"
                        >
                            <MoreHorizontal size={20} />
                            <span className="text-[10px] font-medium">Lainnya</span>
                        </button>
                    )}
                </div>
            </div>

            {/* --- MOBILE MENU MODAL --- */}
            {showMobileMenu && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Menu Lainnya</h3>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                            >
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Menu List */}
                        <div className="p-4 space-y-2">
                            {moreMenus.map((menu, index) => (
                                <Link
                                    key={index}
                                    href={menu.href}
                                    onClick={() => setShowMobileMenu(false)}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                                        menu.active
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${
                                        menu.active
                                        ? 'bg-blue-100 dark:bg-blue-900/50'
                                        : 'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                        {menu.icon}
                                    </div>
                                    <span className="font-medium text-sm">{menu.title}</span>
                                </Link>
                            ))}

                            {/* Logout Button */}
                            <Link
                                href={safeRoute('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                            >
                                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                                    <LogOut size={20} />
                                </div>
                                <span className="font-medium text-sm">Keluar</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
