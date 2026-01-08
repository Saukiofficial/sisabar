import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar, BookOpen, Clock, FileText, ImageIcon, User,
    Search, Eye, X, CheckCircle, Printer
} from 'lucide-react';

export default function MonitoringJurnal({ auth, jurnals, filterDate }) {
    const [date, setDate] = useState(filterDate);
    const [selectedJurnal, setSelectedJurnal] = useState(null); // Data untuk modal detail
    const [showModal, setShowModal] = useState(false);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.get(route('kepsek.jurnal'), { date: newDate }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const openDetail = (jurnal) => {
        setSelectedJurnal(jurnal);
        setShowModal(true);
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Monitoring Jurnal Mengajar">
            <Head title="Monitoring Jurnal" />

            {/* CSS Print Helper */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-area, #printable-area * { visibility: visible; }
                    #printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* HEADER & FILTER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 no-print">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Jurnal Mengajar Harian</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pantau aktivitas pembelajaran guru secara detail.</p>
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
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 no-print">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guru & Waktu</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mapel / Kelas</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Materi Pokok</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kehadiran</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {jurnals.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                                <p className="font-medium">Belum ada jurnal masuk pada tanggal ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    jurnals.map((jurnal, index) => (
                                        <tr key={jurnal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-sm">{index + 1}</td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-xs mr-3 border border-purple-200 dark:border-purple-700">
                                                        {jurnal.guru.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {jurnal.guru.user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(jurnal.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </div>
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
                                                <div className="max-w-xs truncate font-medium" title={jurnal.materi}>
                                                    {jurnal.materi}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate max-w-xs">
                                                    {jurnal.sub_materi || '-'}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center gap-2 text-xs font-bold">
                                                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded" title="Hadir">H: {jurnal.jml_hadir}</span>
                                                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded" title="Alpa/Absen">A: {jurnal.jml_alpa}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => openDetail(jurnal)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                                                >
                                                    <Eye className="w-3 h-3 mr-1" /> Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MODAL DETAIL JURNAL (SUPERVISI) --- */}
                {showModal && selectedJurnal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
                        <div className="bg-white w-full max-w-4xl min-h-screen md:min-h-0 md:rounded-xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-200">

                            {/* Toolbar Modal */}
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50 no-print rounded-t-xl">
                                <h3 className="font-bold text-gray-700 text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-600" /> Detail Jurnal Mengajar
                                </h3>
                                <div className="flex gap-2">
                                    {selectedJurnal.dokumentasi && (
                                        <a
                                            href={`/storage/${selectedJurnal.dokumentasi}`}
                                            target="_blank"
                                            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-200 flex items-center gap-1"
                                        >
                                            <ImageIcon className="w-4 h-4" /> Bukti Foto
                                        </a>
                                    )}
                                    <button onClick={() => window.print()} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 flex items-center gap-1">
                                        <Printer className="w-4 h-4" /> Cetak
                                    </button>
                                    <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-full transition">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* KONTEN DETAIL (Bisa Dicetak) */}
                            <div id="printable-area" className="p-8 md:p-10 font-serif text-black leading-relaxed bg-white">
                                {/* Kop Surat Sederhana */}
                                <div className="text-center border-b-2 border-black pb-4 mb-6">
                                    <h4 className="text-lg font-bold uppercase tracking-wider mb-1">LEMBAR MONITORING PEMBELAJARAN</h4>
                                    <p className="text-sm">Tanggal: {new Date(selectedJurnal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>

                                <table className="w-full mb-6 text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="font-bold w-32 py-1">Nama Guru</td>
                                            <td>: {selectedJurnal.guru.user.name}</td>
                                            <td className="font-bold w-32">Kelas</td>
                                            <td>: {selectedJurnal.kelas.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold py-1">Mata Pelajaran</td>
                                            <td>: {selectedJurnal.mapel.nama_mapel}</td>
                                            <td className="font-bold">Pertemuan Ke</td>
                                            <td>: {selectedJurnal.pertemuan_ke} ({selectedJurnal.semester})</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold py-1">Jam Pelajaran</td>
                                            <td>: {selectedJurnal.jam_pelajaran || '-'}</td>
                                            <td className="font-bold">Waktu Input</td>
                                            <td>: {new Date(selectedJurnal.created_at).toLocaleString('id-ID')}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Section A: Materi */}
                                <div className="mb-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                    <h5 className="font-bold border-b border-gray-300 mb-2 pb-1 text-sm uppercase">A. Materi Pembelajaran</h5>
                                    <div className="text-sm space-y-1">
                                        <p><span className="font-bold">Kompetensi Dasar (KD):</span> {selectedJurnal.ki_kd || '-'}</p>
                                        <p><span className="font-bold">Materi Pokok:</span> {selectedJurnal.materi}</p>
                                        <p><span className="font-bold">Sub Materi:</span> {selectedJurnal.sub_materi || '-'}</p>
                                    </div>
                                </div>

                                {/* Section B: Kegiatan */}
                                <div className="mb-6">
                                    <h5 className="font-bold border-b border-black mb-2 pb-1 text-sm uppercase">B. Detail Kegiatan</h5>
                                    <div className="grid grid-cols-1 gap-4 text-sm">
                                        <div>
                                            <p className="font-bold text-gray-700 underline">Tujuan Pembelajaran:</p>
                                            <p className="italic text-gray-600">{selectedJurnal.tujuan_pembelajaran || 'Tidak diisi'}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700 underline">Kegiatan Pembelajaran:</p>
                                            <p className="whitespace-pre-wrap">{selectedJurnal.kegiatan_pembelajaran || '-'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="font-bold text-gray-700">Media/Alat:</p>
                                                <p>{selectedJurnal.media_belajar || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-700">Metode Penilaian:</p>
                                                <p>{selectedJurnal.jenis_penilaian || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section C: Statistik */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="border border-gray-300 rounded p-3">
                                        <h5 className="font-bold text-center border-b border-gray-300 mb-2 pb-1 text-sm">Kehadiran Siswa</h5>
                                        <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                            <div className="bg-green-50 p-1 rounded">Hadir: <b>{selectedJurnal.jml_hadir}</b></div>
                                            <div className="bg-red-50 p-1 rounded">Alpa: <b>{selectedJurnal.jml_alpa}</b></div>
                                            <div className="bg-blue-50 p-1 rounded">Izin: <b>{selectedJurnal.jml_izin}</b></div>
                                            <div className="bg-yellow-50 p-1 rounded">Sakit: <b>{selectedJurnal.jml_sakit}</b></div>
                                        </div>
                                    </div>
                                    <div className="border border-gray-300 rounded p-3">
                                        <h5 className="font-bold text-center border-b border-gray-300 mb-2 pb-1 text-sm">Catatan & Evaluasi</h5>
                                        <div className="text-sm space-y-2">
                                            <p><span className="font-bold">PR/Tugas:</span> {selectedJurnal.tugas_pr || '-'}</p>
                                            <p><span className="font-bold">Kendala:</span> {selectedJurnal.permasalahan_kbm || '-'}</p>
                                            <p><span className="font-bold">Catatan:</span> {selectedJurnal.catatan || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tanda Tangan */}
                                <div className="flex justify-between mt-12 px-8">
                                    <div className="text-center">
                                        <p className="mb-16">Mengetahui,<br/>Kepala Sekolah</p>
                                        <p className="font-bold underline">.........................</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="mb-16">Guru Mata Pelajaran</p>
                                        <p className="font-bold underline">{selectedJurnal.guru.user.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
