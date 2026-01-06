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
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Jadwal Mengajar Saya</h2>}>
            <Head title="Jadwal Mengajar" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {jadwals.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-sm text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700">Belum Ada Jadwal</h3>
                        <p className="text-gray-500">Admin belum menambahkan jadwal mengajar untuk Anda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {daysOrder.map(hari => (
                            groupedJadwals[hari] && (
                                <div key={hari} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Header Hari */}
                                    <div className="bg-indigo-600 text-white px-6 py-3 flex justify-between items-center">
                                        <h3 className="font-bold text-lg">{hari}</h3>
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                            {groupedJadwals[hari].length} Kelas
                                        </span>
                                    </div>

                                    {/* List Jam */}
                                    <div className="divide-y divide-gray-100">
                                        {groupedJadwals[hari].map((jadwal) => (
                                            <div key={jadwal.id} className="p-5 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center text-indigo-600 font-bold text-sm bg-indigo-50 px-2 py-1 rounded">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}
                                                    </div>
                                                </div>

                                                <h4 className="text-gray-800 font-bold text-lg mb-1">{jadwal.mapel.nama_mapel}</h4>

                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                    Kelas: <span className="font-semibold text-gray-700 ml-1">{jadwal.kelas.nama_kelas}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
