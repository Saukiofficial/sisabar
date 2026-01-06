import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, MapPin, Clock, User, ArrowLeft } from 'lucide-react';

export default function MonitoringAbsensi({ auth, absensis, filterDate }) {
    const [date, setDate] = useState(filterDate);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        // Reload halaman dengan filter tanggal baru
        router.get(route('kepsek.absensi'), { date: newDate }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Monitoring Kehadiran Guru">
            <Head title="Rekap Absensi Guru" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* HEADER & FILTER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Rekap Harian Guru</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pantau jam masuk & pulang guru.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Pilih Tanggal:</label>
                        <input
                            type="date"
                            className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Guru</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jam Masuk</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jam Pulang</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lokasi Scan</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {absensis.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                                <p className="font-medium">Tidak ada data kehadiran pada tanggal ini.</p>
                                                <p className="text-xs mt-1">Coba pilih tanggal lain.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    absensis.map((absen, index) => (
                                        <tr key={absen.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-sm">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs mr-3 border border-indigo-200 dark:border-indigo-700">
                                                        {absen.guru.user.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {absen.guru.user.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                <span className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-md border border-green-100 dark:border-green-800 w-fit font-mono font-medium">
                                                    <Clock className="w-3.5 h-3.5" /> {absen.jam_masuk}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {absen.jam_pulang ? (
                                                    <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-800 w-fit font-mono font-medium">
                                                        <Clock className="w-3.5 h-3.5" /> {absen.jam_pulang}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">Belum Pulang</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs" title={absen.lokasi}>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                    {absen.lokasi || <span className="italic text-gray-400">Tidak terdeteksi</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {/* Logika Sederhana: Di atas 07:30 dianggap Telat */}
                                                {absen.jam_masuk > '07:30:00' ? (
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
                                                        Telat
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800">
                                                        Tepat Waktu
                                                    </span>
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
