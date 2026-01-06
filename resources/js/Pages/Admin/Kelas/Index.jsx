import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, Building, X } from 'lucide-react';

export default function KelasIndex({ auth, kelas }) {
    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        id: '',
        nama_kelas: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // --- LOGIKA MODAL ---
    const openModal = (item = null) => {
        setIsEdit(!!item);
        if (item) {
            // Mode Edit
            setData({
                id: item.id,
                nama_kelas: item.nama_kelas
            });
        } else {
            // Mode Tambah
            setData({ id: '', nama_kelas: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    // --- LOGIKA SUBMIT ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            // Update: PUT ke route update
            put(route('kelas.update', data.id), {
                onSuccess: () => closeModal()
            });
        } else {
            // Create: POST ke route store
            post(route('kelas.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    // --- LOGIKA HAPUS ---
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kelas ini?')) {
            destroy(route('kelas.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Manajemen Kelas</h2>}>
            <Head title="Data Kelas" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">

                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <Building className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-700">Daftar Kelas</h3>
                            <p className="text-xs text-gray-500">Kelola data kelas sekolah.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Tambah Kelas
                    </button>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-20">No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama Kelas</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {kelas.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500">Belum ada data kelas.</td>
                                </tr>
                            ) : (
                                kelas.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-sm">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{item.nama_kelas}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-md transition"
                                                >
                                                    <Pencil className="w-4 h-4" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1 rounded-md transition"
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

                {/* MODAL FORM */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {isEdit ? 'Edit Nama Kelas' : 'Tambah Kelas Baru'}
                                </h3>
                                <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                        placeholder="Contoh: X RPL 1"
                                        value={data.nama_kelas}
                                        onChange={e => setData('nama_kelas', e.target.value)}
                                        autoFocus
                                    />
                                    {errors.nama_kelas && <p className="text-red-500 text-xs mt-1">{errors.nama_kelas}</p>}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Batal</button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Simpan')}
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
