import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Calendar, Filter, User } from 'lucide-react';

export default function RiwayatAbsensi({ auth, absensis, filters, tanggal_hari_ini }) {
    const [tanggal, setTanggal] = useState(filters.tanggal || tanggal_hari_ini);
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('admin.absensi.riwayat'), { tanggal, status }, { preserveState: true });
    };

    // Helper untuk warna badge status
    const getStatusColor = (status) => {
        switch(status) {
            case 'Hadir': return 'bg-green-100 text-green-800';
            case 'Terlambat': return 'bg-yellow-100 text-yellow-800';
            case 'Izin': return 'bg-blue-100 text-blue-800';
            case 'Sakit': return 'bg-purple-100 text-purple-800';
            default: return 'bg-red-100 text-red-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Riwayat Absensi Harian</h2>}
        >
            <Head title="Riwayat Absensi" />

            <div className="py-6 px-4">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-white"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Status</label>
                        <select
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-white"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="Hadir">Hadir</option>
                            <option value="Terlambat">Terlambat</option>
                            <option value="Izin">Izin</option>
                            <option value="Sakit">Sakit</option>
                            <option value="Alpha">Alpha</option>
                        </select>
                    </div>
                    <button
                        onClick={handleFilter}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Filter Data
                    </button>
                </div>

                {/* Tabel Data */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Role / Kelas</th>
                                    <th className="px-6 py-3">Jam Masuk</th>
                                    <th className="px-6 py-3">Jam Pulang</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {absensis.data.length > 0 ? (
                                    absensis.data.map((absen) => {
                                        // Logic untuk menampilkan nama & info (Siswa/Guru)
                                        const nama = absen.user?.name || 'User Dihapus';
                                        let info = '-';

                                        // Cek apakah data user punya relasi siswa atau guru
                                        if (absen.user?.siswa) {
                                            info = `Siswa (${absen.user.siswa.kelas?.nama_kelas || '-'})`;
                                        } else if (absen.user?.guru) {
                                            info = 'Guru Pengajar';
                                        }

                                        return (
                                            <tr key={absen.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    {nama}
                                                </td>
                                                <td className="px-6 py-4">{info}</td>
                                                <td className="px-6 py-4 font-mono text-green-600">{absen.waktu_masuk || '-'}</td>
                                                <td className="px-6 py-4 font-mono text-red-600">{absen.waktu_pulang || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(absen.status)}`}>
                                                        {absen.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs italic text-gray-500">{absen.keterangan || '-'}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                            Tidak ada data absensi pada tanggal ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        {/* (Kode pagination sama seperti di Index Siswa) */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
