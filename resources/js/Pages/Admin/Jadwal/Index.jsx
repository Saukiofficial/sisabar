import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Trash2, Plus, Clock, X, Pencil } from 'lucide-react';

export default function JadwalIndex({ auth, jadwals, kelas, mapels, gurus, filters }) {
    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        id: '',
        hari: 'Senin',
        kelas_id: '',
        mapel_id: '',
        guru_id: '',
        jam_mulai: '',
        jam_selesai: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [filterKelas, setFilterKelas] = useState(filters.kelas_id || '');

    const handleFilter = (val) => {
        setFilterKelas(val);
        router.get(route('jadwals.index'), { kelas_id: val }, { preserveState: true });
    };

    const openModal = (jadwal = null) => {
        setIsEdit(!!jadwal);

        if (jadwal) {
            setData({
                id: jadwal.id,
                hari: jadwal.hari,
                kelas_id: jadwal.kelas_id,
                mapel_id: jadwal.mapel_id,
                guru_id: jadwal.guru_id,
                jam_mulai: jadwal.jam_mulai,
                jam_selesai: jadwal.jam_selesai
            });
        } else {
            setData({
                id: '',
                hari: 'Senin',
                kelas_id: '',
                mapel_id: '',
                guru_id: '',
                jam_mulai: '',
                jam_selesai: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('jadwals.update', data.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('jadwals.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus jadwal ini?')) destroy(route('jadwals.destroy', id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Jadwal Pelajaran</h2>}>
            <Head title="Atur Jadwal" />

            <div className="py-6 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* TOOLBAR */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-4 md:mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Filter Kelas:</span>
                        <select
                            className="w-full sm:w-auto border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={filterKelas}
                            onChange={(e) => handleFilter(e.target.value)}
                        >
                            <option value="">Semua Kelas</option>
                            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" /> Tambah Jadwal
                    </button>
                </div>

                {/* TABEL JADWAL - Desktop */}
                <div className="hidden md:block bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Hari / Jam</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Kelas</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Mapel</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Guru Pengajar</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {jadwals.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        Belum ada jadwal yang diatur.
                                    </td>
                                </tr>
                            ) : (
                                jadwals.data.map((jadwal) => (
                                    <tr key={jadwal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-gray-100">{jadwal.hari}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> {jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-indigo-600 dark:text-indigo-400 font-bold">{jadwal.kelas.nama_kelas}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{jadwal.mapel.nama_mapel}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{jadwal.guru?.user?.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openModal(jadwal)}
                                                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded transition"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(jadwal.id)}
                                                    className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {jadwals.links && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2 flex-wrap">
                            {jadwals.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, { kelas_id: filterKelas })}
                                    className={`px-3 py-1 text-sm rounded transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CARDS - Mobile */}
                <div className="md:hidden space-y-3">
                    {jadwals.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                            Belum ada jadwal yang diatur.
                        </div>
                    ) : (
                        jadwals.data.map((jadwal) => (
                            <div key={jadwal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{jadwal.hari}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openModal(jadwal)}
                                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded transition"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(jadwal.id)}
                                            className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Kelas</span>
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{jadwal.kelas.nama_kelas}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mapel</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{jadwal.mapel.nama_mapel}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Guru</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{jadwal.guru?.user?.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination Mobile */}
                    {jadwals.links && (
                        <div className="flex justify-center gap-2 flex-wrap pt-2">
                            {jadwals.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, { kelas_id: filterKelas })}
                                    className={`px-3 py-1 text-sm rounded transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL FORM */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {isEdit ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Hari</label>
                                    <select
                                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.hari}
                                        onChange={e => setData('hari', e.target.value)}
                                    >
                                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Kelas</label>
                                    <select
                                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.kelas_id}
                                        onChange={e => setData('kelas_id', e.target.value)}
                                        required
                                    >
                                        <option value="">- Pilih -</option>
                                        {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Mata Pelajaran</label>
                                <select
                                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={data.mapel_id}
                                    onChange={e => setData('mapel_id', e.target.value)}
                                    required
                                >
                                    <option value="">- Pilih Mapel -</option>
                                    {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Guru Pengajar</label>
                                <select
                                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={data.guru_id}
                                    onChange={e => setData('guru_id', e.target.value)}
                                    required
                                >
                                    <option value="">- Pilih Guru -</option>
                                    {gurus.map(g => <option key={g.id} value={g.id}>{g.user.name} ({g.mapel?.nama_mapel})</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Jam Mulai</label>
                                    <input
                                        type="time"
                                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.jam_mulai}
                                        onChange={e => setData('jam_mulai', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Jam Selesai</label>
                                    <input
                                        type="time"
                                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.jam_selesai}
                                        onChange={e => setData('jam_selesai', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row justify-end gap-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-md disabled:opacity-50"
                                >
                                    {isEdit ? 'Simpan Perubahan' : 'Simpan Jadwal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
