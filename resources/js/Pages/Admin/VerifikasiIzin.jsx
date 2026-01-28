import React from 'react';
// Sesuaikan path ini dengan struktur folder Anda.
// Jika file ini ada di resources/js/Pages/Admin/, maka path ke Layouts biasanya ../../Layouts/
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User,
    Filter,
    FileText,
    AlertCircle
} from 'lucide-react';

export default function VerifikasiIzin({ auth, pengajuans }) {
    // Helper form untuk menangani aksi verifikasi tanpa reload manual
    const { post, processing } = useForm();

    const handleVerifikasi = (id, status) => {
        // Konfirmasi sederhana sebelum memproses
        if (window.confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) {
            // Mengirim request POST ke route admin.izin.verifikasi
            post(route('admin.izin.verifikasi', { id, status }));
        }
    };

    // Fungsi untuk menampilkan badge status yang berwarna
    const getStatusBadge = (status) => {
        switch(status) {
            case 'Disetujui':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1 w-fit">
                        <CheckCircle size={12}/> Disetujui
                    </span>
                );
            case 'Ditolak':
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1 w-fit">
                        <XCircle size={12}/> Ditolak
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1 w-fit">
                        <Clock size={12}/> Menunggu
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Verifikasi Izin Siswa</h2>}
        >
            <Head title="Verifikasi Izin" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- RINGKASAN STATISTIK (OPSIONAL) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-amber-400 border-gray-100 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Menunggu Verifikasi</div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                            {pengajuans.filter(p => p.status === 'Menunggu Verifikasi').length}
                        </div>
                    </div>
                </div>

                {/* --- TABEL PENGAJUAN --- */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <FileText size={18} className="text-blue-600"/> Daftar Pengajuan Masuk
                        </h3>
                        {/* Tombol Filter sederhana (Placeholder) */}
                        <button className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Filter size={14}/> Filter Status
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs font-semibold">
                                <tr>
                                    <th className="p-4">Siswa</th>
                                    <th className="p-4">Tanggal & Jenis</th>
                                    <th className="p-4">Alasan</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {pengajuans.length > 0 ? pengajuans.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm shrink-0">
                                                    {item.user?.name ? item.user.name.charAt(0) : <User size={16}/>}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-white">{item.user?.name || 'Siswa Tanpa Nama'}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Kelas: {item.user?.siswa?.kelas?.nama_kelas || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-700 dark:text-gray-300 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded w-fit">
                                                    {item.jenis}
                                                </span>
                                                <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                                                    <span className="flex items-center gap-1"><Calendar size={12}/> {item.tanggal_mulai}</span>
                                                    <span className="pl-4 text-[10px] opacity-70">s/d</span>
                                                    <span className="flex items-center gap-1"><Calendar size={12}/> {item.tanggal_selesai}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <p className="text-gray-600 dark:text-gray-300 italic text-xs leading-relaxed line-clamp-2">
                                                "{item.keterangan}"
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {item.status === 'Menunggu Verifikasi' ? (
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleVerifikasi(item.id, 'Disetujui')}
                                                        disabled={processing}
                                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all border border-green-200 shadow-sm disabled:opacity-50"
                                                        title="Terima Pengajuan"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerifikasi(item.id, 'Ditolak')}
                                                        disabled={processing}
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-200 shadow-sm disabled:opacity-50"
                                                        title="Tolak Pengajuan"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Selesai</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <AlertCircle size={32} className="opacity-20"/>
                                                <span>Tidak ada pengajuan izin yang ditemukan.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
