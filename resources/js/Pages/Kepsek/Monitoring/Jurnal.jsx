import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, BookOpen, Clock, FileText, ImageIcon, User } from 'lucide-react';

export default function MonitoringJurnal({ auth, jurnals, filterDate }) {
    const [date, setDate] = useState(filterDate);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        // Reload halaman dengan filter tanggal baru
        router.get(route('kepsek.jurnal'), { date: newDate }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Monitoring Jurnal Mengajar">
            <Head title="Monitoring Jurnal" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* HEADER & FILTER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Jurnal Mengajar Harian</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pantau materi yang diajarkan guru hari ini.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Pilih Tanggal:</label>
                        <input
                            type="date"
                            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 w-full md:w-auto"
                            value={date}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>

                {/* TABEL DATA */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waktu Input</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Guru</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kelas & Mapel</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Materi Pembelajaran</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bukti</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {jurnals.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                                <p className="font-medium">Belum ada jurnal masuk pada tanggal ini.</p>
                                                <p className="text-xs mt-1">Silakan pilih tanggal lain atau tunggu guru mengisi jurnal.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    jurnals.map((jurnal, index) => (
                                        <tr key={jurnal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-sm">{index + 1}</td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 font-mono">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(jurnal.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-xs mr-3 border border-purple-200 dark:border-purple-700">
                                                        {jurnal.guru.user.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {jurnal.guru.user.name}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-100 font-bold">{jurnal.mapel.nama_mapel}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded w-fit mt-1">
                                                    {jurnal.kelas.nama_kelas}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="max-w-xs truncate" title={jurnal.materi}>
                                                    {jurnal.materi}
                                                </div>
                                                {jurnal.catatan && (
                                                    <p className="text-xs text-gray-400 mt-1 italic truncate max-w-xs">Note: {jurnal.catatan}</p>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {jurnal.dokumentasi ? (
                                                    <a
                                                        href={`/storage/${jurnal.dokumentasi}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition border border-gray-200 dark:border-gray-600 hover:border-purple-200"
                                                        title="Lihat Foto Dokumentasi"
                                                    >
                                                        <ImageIcon className="w-4 h-4" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
