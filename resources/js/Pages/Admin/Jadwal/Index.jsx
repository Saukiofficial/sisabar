import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Trash2, Plus, Clock, X, Pencil } from 'lucide-react';

export default function JadwalIndex({ auth, jadwals, kelas, mapels, gurus, filters }) {
    // Tambahkan 'id' di useForm untuk keperluan Edit
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
    const [isEdit, setIsEdit] = useState(false); // State untuk cek mode edit/tambah
    const [filterKelas, setFilterKelas] = useState(filters.kelas_id || '');

    const handleFilter = (val) => {
        setFilterKelas(val);
        router.get(route('jadwals.index'), { kelas_id: val }, { preserveState: true });
    };

    // --- LOGIKA BUKA MODAL (BARU) ---
    const openModal = (jadwal = null) => {
        setIsEdit(!!jadwal); // Jika jadwal ada, berarti Edit Mode

        if (jadwal) {
            // Isi form dengan data yang mau diedit
            setData({
                id: jadwal.id,
                hari: jadwal.hari,
                kelas_id: jadwal.kelas_id,
                mapel_id: jadwal.mapel_id,
                guru_id: jadwal.guru_id,
                jam_mulai: jadwal.jam_mulai, // Pastikan format HH:mm:ss
                jam_selesai: jadwal.jam_selesai
            });
        } else {
            // Reset form untuk data baru
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

    // --- LOGIKA SUBMIT (BARU) ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            // Panggil route update (PUT)
            put(route('jadwals.update', data.id), {
                onSuccess: () => closeModal()
            });
        } else {
            // Panggil route store (POST)
            post(route('jadwals.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus jadwal ini?')) destroy(route('jadwals.destroy', id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Jadwal Pelajaran</h2>}>
            <Head title="Atur Jadwal" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* TOOLBAR */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-sm font-bold text-gray-600">Filter Kelas:</span>
                        <select className="border-gray-300 rounded-lg text-sm focus:ring-indigo-500" value={filterKelas} onChange={(e) => handleFilter(e.target.value)}>
                            <option value="">Semua Kelas</option>
                            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                        </select>
                    </div>
                    <button onClick={() => openModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <Plus className="w-4 h-4" /> Tambah Jadwal
                    </button>
                </div>

                {/* TABEL JADWAL */}
                <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Hari / Jam</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Kelas</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mapel</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Guru Pengajar</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jadwals.data.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Belum ada jadwal yang diatur.</td></tr>
                            ) : (
                                jadwals.data.map((jadwal) => (
                                    <tr key={jadwal.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{jadwal.hari}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> {jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-indigo-600 font-bold">{jadwal.kelas.nama_kelas}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{jadwal.mapel.nama_mapel}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{jadwal.guru?.user?.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                {/* TOMBOL EDIT */}
                                                <button onClick={() => openModal(jadwal)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition">
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                {/* TOMBOL HAPUS */}
                                                <button onClick={() => handleDelete(jadwal.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination (Jika data banyak) */}
                    {jadwals.links && (
                        <div className="p-4 border-t flex justify-center gap-2">
                            {jadwals.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, { kelas_id: filterKelas })}
                                    className={`px-3 py-1 text-sm rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isEdit ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Hari</label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-indigo-500" value={data.hari} onChange={e => setData('hari', e.target.value)}>
                                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Kelas</label>
                                    <select className="w-full border-gray-300 rounded-lg focus:ring-indigo-500" value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)} required>
                                        <option value="">- Pilih -</option>
                                        {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-1 text-gray-700">Mata Pelajaran</label>
                                <select className="w-full border-gray-300 rounded-lg focus:ring-indigo-500" value={data.mapel_id} onChange={e => setData('mapel_id', e.target.value)} required>
                                    <option value="">- Pilih Mapel -</option>
                                    {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-1 text-gray-700">Guru Pengajar</label>
                                <select className="w-full border-gray-300 rounded-lg focus:ring-indigo-500" value={data.guru_id} onChange={e => setData('guru_id', e.target.value)} required>
                                    <option value="">- Pilih Guru -</option>
                                    {gurus.map(g => <option key={g.id} value={g.id}>{g.user.name} ({g.mapel?.nama_mapel})</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Jam Mulai</label>
                                    <input type="time" className="w-full border-gray-300 rounded-lg focus:ring-indigo-500" value={data.jam_mulai} onChange={e => setData('jam_mulai', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Jam Selesai</label>
                                    <input type="time" className="w-full border-gray-300 rounded-lg focus:ring-indigo-500" value={data.jam_selesai} onChange={e => setData('jam_selesai', e.target.value)} required />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
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
