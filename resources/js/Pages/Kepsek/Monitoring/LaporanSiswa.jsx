import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { GraduationCap, Filter, Printer, Search, UserCheck, UserX, AlertCircle } from 'lucide-react';

export default function LaporanSiswa({ auth, laporan, kelas_list, filters }) {
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [month, setMonth] = useState(filters.month);
    const [year, setYear] = useState(filters.year);

    const handleFilter = () => {
        router.get(route('kepsek.laporan-siswa'), {
            kelas_id: kelasId,
            month: month,
            year: year
        }, { preserveState: true });
    };

    // URL untuk print PDF
    const printUrl = route('export.absensi-murid', {
        kelas_id: kelasId || (kelas_list[0] ? kelas_list[0].id : 0),
        month: month,
        year: year
    });

    return (
        <AuthenticatedLayout user={auth.user} header="Laporan Kehadiran Siswa">
            <Head title="Laporan Siswa" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* TOOLBAR FILTER */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Kelas</label>
                            <select
                                className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
                                value={kelasId}
                                onChange={(e) => setKelasId(e.target.value)}
                            >
                                <option value="">Semua Kelas</option>
                                {kelas_list.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Bulan</label>
                            <select
                                className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Tahun</label>
                            <input
                                type="number"
                                className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 w-24"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col justify-end">
                            <button
                                onClick={handleFilter}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition shadow-lg shadow-orange-200 dark:shadow-none"
                            >
                                <Filter className="w-4 h-4" /> Tampilkan
                            </button>
                        </div>
                    </div>

                    {/* TOMBOL PRINT */}
                    {kelasId && (
                        <a
                            href={printUrl}
                            target="_blank"
                            className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-900 transition shadow-lg"
                        >
                            <Printer className="w-4 h-4" /> Cetak Laporan
                        </a>
                    )}
                </div>

                {/* INFO RINGKASAN */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-green-500 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Total Hadir</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                                {laporan.reduce((acc, curr) => acc + (curr.h || 0), 0)}
                            </p>
                        </div>
                        <UserCheck className="w-8 h-8 text-green-100" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-red-500 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Total Alpa</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                                {laporan.reduce((acc, curr) => acc + (curr.a || 0), 0)}
                            </p>
                        </div>
                        <UserX className="w-8 h-8 text-red-100" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Total Izin/Sakit</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                                {laporan.reduce((acc, curr) => acc + (curr.i || 0) + (curr.s || 0), 0)}
                            </p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-blue-100" />
                    </div>
                </div>

                {/* TABEL DATA */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-orange-50 dark:bg-orange-900/20">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase w-10">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Nama Siswa</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Kelas</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-green-600 dark:text-green-400 uppercase">Hadir</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Sakit</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Izin</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-red-600 dark:text-red-400 uppercase">Alpha</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">% Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {laporan.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <GraduationCap className="w-12 h-12 text-gray-300 mb-2" />
                                                <p>Tidak ada data siswa yang ditemukan untuk periode ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    laporan.map((siswa, index) => {
                                        // Gunakan nilai default 0 jika undefined/null
                                        const h = siswa.h || 0;
                                        const s = siswa.s || 0;
                                        const i = siswa.i || 0;
                                        const a = siswa.a || 0;

                                        // Hitung total pertemuan yang seharusnya dihadiri
                                        const totalPertemuan = h + s + i + a;

                                        // Hitung persentase (Hadir / Total Pertemuan)
                                        // Jika total 0, maka persentase 0 (hindari division by zero)
                                        const percentage = totalPertemuan > 0
                                            ? Math.round((h / totalPertemuan) * 100)
                                            : 0;

                                        // Warna progress bar dinamis
                                        let progressColor = 'bg-green-500';
                                        if (percentage < 50) progressColor = 'bg-red-500';
                                        else if (percentage < 80) progressColor = 'bg-yellow-500';

                                        return (
                                            <tr key={siswa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 text-sm font-mono">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                                                    {siswa.nama}
                                                    <div className="text-xs text-gray-400 font-normal">{siswa.nis || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                                        {siswa.kelas || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-green-600 dark:text-green-400">{h}</td>
                                                <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400">{s}</td>
                                                <td className="px-6 py-4 text-center font-bold text-purple-600 dark:text-purple-400">{i}</td>
                                                <td className="px-6 py-4 text-center font-bold text-red-600 dark:text-red-400">{a}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2" title={`Total Pertemuan: ${totalPertemuan}`}>
                                                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                            <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-8 text-right">{percentage}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
