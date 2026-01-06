import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Book, Upload, FileText, AlertCircle } from 'lucide-react';

export default function JurnalIndex({ auth, jurnals, kelas, mapels }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        kelas_id: '', mapel_id: '', materi: '', catatan: '', dokumentasi: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('guru.jurnal.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Jurnal Mengajar</h2>}>
            <Head title="Jurnal" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* FORM INPUT */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
                    <div className="flex items-center gap-2 mb-6 border-b pb-4">
                        <Book className="w-6 h-6 text-indigo-600" />
                        <h3 className="font-bold text-lg text-gray-800">Isi Jurnal Hari Ini</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Kelas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                            <select
                                className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={data.kelas_id}
                                onChange={e => setData('kelas_id', e.target.value)}
                            >
                                <option value="">Pilih Kelas</option>
                                {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                            </select>
                            {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                        </div>

                        {/* Mapel */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mapel</label>
                            <select
                                className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={data.mapel_id}
                                onChange={e => setData('mapel_id', e.target.value)}
                            >
                                <option value="">Pilih Mapel</option>
                                {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                            </select>
                            {errors.mapel_id && <p className="text-red-500 text-xs mt-1">{errors.mapel_id}</p>}
                        </div>

                        {/* Materi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Materi</label>
                            <textarea
                                className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                rows="3"
                                value={data.materi}
                                onChange={e => setData('materi', e.target.value)}
                                placeholder="Contoh: Perkalian Pecahan"
                            ></textarea>
                            {errors.materi && <p className="text-red-500 text-xs mt-1">{errors.materi}</p>}
                        </div>

                        {/* Upload File */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dokumentasi (Foto/PDF)</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {data.dokumentasi ? (
                                            <>
                                                <FileText className="w-8 h-8 text-green-500 mb-2" />
                                                <p className="text-sm text-gray-500">{data.dokumentasi.name}</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500">Klik untuk upload (Max 5MB)</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={e => setData('dokumentasi', e.target.files[0])}
                                        accept="image/*,.pdf,.doc,.docx" // Filter di file explorer
                                    />
                                </label>
                            </div>
                            {/* PESAN ERROR YANG SEBELUMNYA HILANG */}
                            {errors.dokumentasi && (
                                <div className="flex items-center gap-1 text-red-500 text-xs mt-2 bg-red-50 p-2 rounded">
                                    <AlertCircle className="w-3 h-3" /> {errors.dokumentasi}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-indigo-200"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Jurnal'}
                        </button>
                    </form>
                </div>

                {/* HISTORY LIST */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Riwayat Jurnal</h3>

                    {jurnals.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <Book className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Belum ada jurnal yang diisi.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jurnals.map(jurnal => (
                                <div key={jurnal.id} className="group relative border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{jurnal.mapel.nama_mapel}</h4>
                                            <p className="text-sm text-indigo-600 font-medium mb-1">{jurnal.kelas.nama_kelas}</p>
                                            <p className="text-sm text-gray-600">{jurnal.materi}</p>
                                        </div>
                                        <span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">
                                            {jurnal.tanggal}
                                        </span>
                                    </div>

                                    {jurnal.dokumentasi && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <a
                                                href={`/storage/${jurnal.dokumentasi}`}
                                                target="_blank"
                                                className="inline-flex items-center text-xs text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-full"
                                            >
                                                <FileText className="w-3 h-3 mr-1" />
                                                Lihat Dokumentasi
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
