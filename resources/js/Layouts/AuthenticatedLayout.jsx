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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    // Helper Route & Active State
    const safeRoute = (name) => {
        try { return route(name); } catch (e) { return '#'; }
    };

    const isActive = (pattern) => {
        try { return route().current(pattern); } catch (e) { return false; }
    };

    // --- KONFIGURASI MENU ---
    const allMenus = [
        // ================= GURU =================
        { show: isGuru, title: 'Dashboard', icon: <Home size={20} />, href: safeRoute('guru.dashboard'), active: isActive('guru.dashboard') },
        { show: isGuru, title: 'Jurnal', icon: <Book size={20} />, href: safeRoute('guru.jurnal.index'), active: isActive('guru.jurnal.*') },
        { show: isGuru, title: 'Absensi', icon: <ClipboardCheck size={20} />, href: safeRoute('guru.absensi.index'), active: isActive('guru.absensi.*') },
        { show: isGuru, title: 'Jadwal', icon: <Activity size={20} />, href: safeRoute('guru.jadwal.index'), active: isActive('guru.jadwal.index') },
        { show: isGuru, title: 'Perangkat', icon: <FileText size={20} />, href: safeRoute('guru.perangkat.index'), active: isActive('guru.perangkat.*') },
        { show: isGuru, title: 'Bank Soal', icon: <List size={20} />, href: safeRoute('guru.bank-soal.index'), active: isActive('guru.bank-soal.*') },
        { show: isGuru, title: 'Ujian', icon: <Edit size={20} />, href: safeRoute('guru.ujian.index'), active: isActive('guru.ujian.*') },
        { show: isGuru, title: 'Ulangan', icon: <Calendar size={20} />, href: safeRoute('guru.ulangan.index'), active: isActive('guru.ulangan.*') },
        { show: isGuru, title: 'Scan QR', icon: <ScanLine size={20} />, href: safeRoute('guru.absensi-saya.index'), active: isActive('guru.absensi-saya.*') },

        // ================= ADMIN =================
        { show: isAdmin, title: 'Dashboard', icon: <Home size={20} />, href: safeRoute('admin.dashboard'), active: isActive('admin.dashboard') },
        { show: isAdmin, title: 'Guru', icon: <Users size={20} />, href: safeRoute('gurus.index'), active: isActive('gurus.*') },
        { show: isAdmin, title: 'Siswa', icon: <GraduationCap size={20} />, href: safeRoute('siswas.index'), active: isActive('siswas.*') },
        { show: isAdmin, title: 'Kelas', icon: <Building size={20} />, href: safeRoute('kelas.index'), active: isActive('kelas.*') },
        { show: isAdmin, title: 'Jadwal', icon: <Activity size={20} />, href: safeRoute('jadwals.index'), active: isActive('jadwals.*') },
        { show: isAdmin, title: 'Mapel', icon: <Book size={20} />, href: safeRoute('mapels.index'), active: isActive('mapels.*') },
        { show: isAdmin, title: 'Bank Soal', icon: <BookOpen size={20} />, href: safeRoute('admin.bank-soal.index'), active: isActive('admin.bank-soal.*') },
        { show: isAdmin, title: 'Monitoring', icon: <FileText size={20} />, href: safeRoute('admin.perangkat.index'), active: isActive('admin.perangkat.*') },
        { show: isAdmin, title: 'QR Code', icon: <ScanLine size={20} />, href: safeRoute('admin.qr.generate'), active: isActive('admin.qr.generate') },

        // ================= KEPSEK =================
        { show: isKepsek, title: 'Dashboard', icon: <Home size={20} />, href: safeRoute('kepsek.dashboard'), active: isActive('kepsek.dashboard') },
        { show: isKepsek, title: 'Supervisi', icon: <CheckCircle size={20} />, href: safeRoute('kepsek.supervisi.index'), active: isActive('kepsek.supervisi.*') },
        { show: isKepsek, title: 'Jurnal', icon: <BookOpen size={20} />, href: safeRoute('kepsek.jurnal'), active: isActive('kepsek.jurnal') },
        { show: isKepsek, title: 'Absensi', icon: <ClipboardCheck size={20} />, href: safeRoute('kepsek.absensi'), active: isActive('kepsek.absensi') },


        // ================= SISWA =================
        { show: isSiswa, title: 'Dashboard', icon: <Home size={20} />, href: safeRoute('siswa.dashboard'), active: isActive('siswa.dashboard') },
        { show: isSiswa, title: 'Ujian', icon: <Calendar size={20} />, href: safeRoute('siswa.ujian.index'), active: isActive('siswa.ujian.*') },
        { show: isSiswa, title: 'Nilai', icon: <GraduationCap size={20} />, href: safeRoute('siswa.nilai.index'), active: isActive('siswa.nilai.*') },
    ];

    const visibleMenus = allMenus.filter(m => m.show);

    // Logic Mobile Menu:
    // Tampilkan 3 menu utama + Tombol "Lainnya" (jika menu banyak) + Tombol "Akun" (Fixed)
    const maxPrimary = 3;
    const showMoreButton = visibleMenus.length > maxPrimary;
    const mobilePrimaryMenus = visibleMenus.slice(0, maxPrimary);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 z-50">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-900/50">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-blue-600 dark:text-white" />
                    </Link>
                    <span className="ml-2 font-bold text-lg text-gray-800 dark:text-white">E- NGAJER</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
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

                {/* Footer Sidebar Desktop */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-2 transition"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="ml-3">{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                    </button>
                    <Link
                        href={safeRoute('logout')} method="post" as="button"
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                        <LogOut size={18} />
                        <span className="ml-3">Keluar</span>
                    </Link>
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
                {/* Header Navbar */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shadow-sm">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link href="/">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-blue-600 dark:text-white" />
                        </Link>
                        <span className="font-bold text-gray-800 dark:text-white">E-NGAJER</span>
                    </div>

                    {/* Desktop Title */}
                    <div className="hidden md:block">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {header || 'Dashboard'}
                        </h1>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button onClick={toggleDarkMode} className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-white focus:outline-none transition">
                                        <div className="flex items-center gap-2">
                                            {/* --- TAMPILKAN FOTO PROFIL HEADER (DESKTOP) --- */}
                                            {user?.avatar ? (
                                                <img
                                                    src={`/storage/${user.avatar}`}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 uppercase">
                                                    {user?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
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

                <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* ================= MOBILE BOTTOM NAV ================= */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 h-[70px] flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-1 safe-area-pb">

                {/* 1. Menu Utama (Dibatasi 3 agar muat dengan Lainnya & Akun) */}
                {mobilePrimaryMenus.map((menu, index) => (
                    <Link
                        key={index}
                        href={menu.href}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${
                            menu.active
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                        }`}
                    >
                        <div className={`p-1.5 rounded-xl ${menu.active ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                            {menu.icon}
                        </div>
                        <span className="text-[10px] font-medium truncate max-w-[60px] leading-none">
                            {menu.title}
                        </span>
                    </Link>
                ))}

                {/* 2. Tombol LAINNYA (Jika menu > 3) */}
                {showMoreButton && (
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 active:scale-95 transition-transform ${isMobileMenuOpen ? 'text-blue-600' : ''}`}
                    >
                        <div className={`p-1.5 rounded-xl ${isMobileMenuOpen ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                            <MoreHorizontal size={20} />
                        </div>
                        <span className="text-[10px] font-medium leading-none">Lainnya</span>
                    </button>
                )}

                {/* 3. Tombol AKUN (Selalu Muncul di Kanan dengan FOTO) */}
                <Link
                    href={safeRoute('profile.edit')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${
                        isActive('profile.edit')
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                    }`}
                >
                    <div className={`p-0.5 rounded-full border-2 ${isActive('profile.edit') ? 'border-blue-500' : 'border-transparent'}`}>
                        {user?.avatar ? (
                            <img
                                src={`/storage/${user.avatar}`}
                                alt="Akun"
                                className="w-6 h-6 rounded-full object-cover bg-gray-200"
                            />
                        ) : (
                            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-medium leading-none">Akun</span>
                </Link>
            </div>

            {/* ================= MOBILE MENU DRAWER (SHEET) ================= */}
            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Drawer Content */}
            <div className={`md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 z-[70] rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
                    <h3 className="font-bold text-gray-800 dark:text-white">Menu Lengkap</h3>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 pb-24 grid grid-cols-4 gap-4">
                    {visibleMenus.map((menu, idx) => (
                        <Link
                            key={idx}
                            href={menu.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                        >
                            <div className={`p-3 rounded-full ${menu.active ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-gray-300'}`}>
                                {menu.icon}
                            </div>
                            <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight">
                                {menu.title}
                            </span>
                        </Link>
                    ))}

                    {/* Menu Pengaturan di Drawer dengan Foto Besar */}
                    <Link
                        href={safeRoute('profile.edit')}
                        className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                        <div className="p-1 rounded-full border-2 border-blue-500 overflow-hidden w-[46px] h-[46px]">
                            {user?.avatar ? (
                                <img
                                    src={`/storage/${user.avatar}`}
                                    alt="Akun"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <Settings size={20} className="text-gray-600 dark:text-gray-300" />
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                            Pengaturan
                        </span>
                    </Link>

                    <Link
                        href={safeRoute('logout')} method="post" as="button"
                        className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                    >
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition">
                            <LogOut size={20} />
                        </div>
                        <span className="text-xs text-center font-medium text-red-600 dark:text-red-400">
                            Keluar
                        </span>
                    </Link>
                </div>
            </div>

        </div>
    );
}
