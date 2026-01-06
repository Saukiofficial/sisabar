import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, UserPlus, X } from 'lucide-react';

export default function GuruIndex({ auth, gurus, mapels, kelas }) {
    // Setup Form dengan field lengkap
    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        id: '',
        name: '',
        username: '',
        password: '',
        mapel_id: '',
        kelas_id: '',
        status_aktif: '1'
    });

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // --- LOGIC BUKA MODAL (ADD / EDIT) ---
    const openModal = (guru = null) => {
        setIsEdit(!!guru); // Jika ada data guru, berarti mode EDIT

        if (guru) {
            // Mode Edit: Isi form dengan data guru yang dipilih
            setData({
                id: guru.id,
                name: guru.user.name,       // Ambil dari relasi user
                username: guru.user.username, // Ambil dari relasi user
                password: '',               // Password kosongkan saja (biar gak keganti kalau gak diisi)
                mapel_id: guru.mapel_id || '',
                kelas_id: guru.kelas_id || '',
                status_aktif: guru.status_aktif ? '1' : '0'
            });
        } else {
            // Mode Add: Reset form jadi kosong
            setData({
                id: '', name: '', username: '', password: '', mapel_id: '', kelas_id: '', status_aktif: '1'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset(); // Bersihkan form saat tutup
    };

    // --- LOGIC SUBMIT ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            // Kirim ke Route Update (PUT)
            put(route('gurus.update', data.id), {
                onSuccess: () => closeModal()
            });
        } else {
            // Kirim ke Route Store (POST)
            post(route('gurus.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    // --- LOGIC DELETE ---
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data guru ini? Akun login juga akan terhapus.')) {
            destroy(route('gurus.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Manajemen Guru</h2>}>
            <Head title="Data Guru" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-700">Daftar Guru Pengajar</h3>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" /> Tambah Guru
                    </button>
                </div>

                {/* Tabel Data */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Guru</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mapel Ajar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wali Kelas</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {gurus.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Belum ada data guru.</td>
                                    </tr>
                                ) : (
                                    gurus.map((guru) => (
                                        <tr key={guru.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{guru.user.name}</div>
                                                <div className="text-xs text-gray-500">{guru.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50 px-2 rounded w-fit">
                                                {guru.user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {guru.mapel ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {guru.mapel.nama_mapel}
                                                    </span>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {guru.kelas ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {guru.kelas.nama_kelas}
                                                    </span>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {guru.status_aktif ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Non-Aktif</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center gap-3">
                                                    {/* TOMBOL EDIT YANG SUDAH BERFUNGSI */}
                                                    <button
                                                        onClick={() => openModal(guru)}
                                                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                                    >
                                                        <Pencil className="w-4 h-4" /> Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(guru.id)}
                                                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL FORM (ADD / EDIT) */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-fade-in-up">

                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {isEdit ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Nama */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input type="text" className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>

                                {/* Username & Password */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <input type="text" className="w-full border-gray-300 rounded-lg bg-gray-50"
                                            value={data.username} onChange={e => setData('username', e.target.value)} required />
                                        {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password {isEdit && <span className="text-xs font-normal text-gray-500">(Opsional)</span>}
                                        </label>
                                        <input type="password" className="w-full border-gray-300 rounded-lg"
                                            value={data.password} onChange={e => setData('password', e.target.value)}
                                            placeholder={isEdit ? "Biarkan kosong jika tetap" : ""}
                                            required={!isEdit} />
                                    </div>
                                </div>

                                {/* Mapel & Wali Kelas */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                                        <select className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={data.mapel_id} onChange={e => setData('mapel_id', e.target.value)}>
                                            <option value="">- Pilih Mapel -</option>
                                            {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Wali Kelas</label>
                                        <select className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)}>
                                            <option value="">- Bukan Wali Kelas -</option>
                                            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Akun</label>
                                    <select className="w-full border-gray-300 rounded-lg"
                                        value={data.status_aktif} onChange={e => setData('status_aktif', e.target.value)}>
                                        <option value="1">Aktif (Bisa Login)</option>
                                        <option value="0">Non-Aktif (Dibekukan)</option>
                                    </select>
                                </div>

                                {/* Footer Buttons */}
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg">
                                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Guru')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
