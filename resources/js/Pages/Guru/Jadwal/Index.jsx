import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';

export default function JadwalGuruIndex({ auth, jadwals }) {

    // Grouping jadwal berdasarkan hari agar tampilan lebih rapi
    const groupedJadwals = jadwals.reduce((acc, jadwal) => {
        (acc[jadwal.hari] = acc[jadwal.hari] || []).push(jadwal);
        return acc;
    }, {});

    const daysOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white">Jadwal Mengajar Saya</h2>}>
            <Head title="Jadwal Mengajar" />

            <div className="py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {jadwals.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <Calendar className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200">Belum Ada Jadwal</h3>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Admin belum menambahkan jadwal mengajar untuk Anda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {daysOrder.map(hari => (
                            groupedJadwals[hari] && (
                                <div key={hari} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    {/* Header Hari */}
                                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <h3 className="font-bold text-base sm:text-lg">{hari}</h3>
                                        </div>
                                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
                                            {groupedJadwals[hari].length} Kelas
                                        </span>
                                    </div>

                                    {/* List Jam */}
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {groupedJadwals[hari].map((jadwal, index) => (
                                            <div key={jadwal.id} className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm bg-indigo-50 dark:bg-indigo-900/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                        {jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}
                                                    </div>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        #{index + 1}
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2 mb-2">
                                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                                                    <h4 className="text-gray-800 dark:text-white font-bold text-sm sm:text-base leading-tight">{jadwal.mapel.nama_mapel}</h4>
                                                </div>

                                                <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-6">
                                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400 dark:text-gray-500" />
                                                    Kelas: <span className="font-semibold text-gray-700 dark:text-gray-300 ml-1">{jadwal.kelas.nama_kelas}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Info Card - Total Jadwal */}
                {jadwals.length > 0 && (
                    <div className="mt-6 sm:mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-4 sm:p-6 rounded-xl border border-blue-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 sm:p-3 bg-blue-500 dark:bg-blue-600 rounded-full">
                                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">Total Jadwal Mengajar</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Minggu ini Anda mengajar di {Object.keys(groupedJadwals).length} hari</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                <span className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{jadwals.length}</span>
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Kelas</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
