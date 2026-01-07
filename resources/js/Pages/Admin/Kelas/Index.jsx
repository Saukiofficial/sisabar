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
            setData({
                id: item.id,
                nama_kelas: item.nama_kelas
            });
        } else {
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
            put(route('kelas.update', data.id), {
                onSuccess: () => closeModal()
            });
        } else {
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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
                    Manajemen Kelas
                </h2>
            }
        >
            <Head title="Data Kelas" />

            <div className="py-6 sm:py-12 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Header Section - Responsive */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <Building className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200">
                                Daftar Kelas
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Kelola data kelas sekolah.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 dark:bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4" /> Tambah Kelas
                    </button>
                </div>

                {/* Table Section - Responsive */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-100 dark:border-gray-700">

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase w-20">
                                        No
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                                        Nama Kelas
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase w-48">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {kelas.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            Belum ada data kelas.
                                        </td>
                                    </tr>
                                ) : (
                                    kelas.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-sm">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800 dark:text-gray-200">
                                                {item.nama_kelas}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1 rounded-md transition"
                                                    >
                                                        <Pencil className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded-md transition"
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

                    {/* Mobile Card View */}
                    <div className="block sm:hidden">
                        {kelas.length === 0 ? (
                            <div className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                                Belum ada data kelas.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {kelas.map((item, index) => (
                                    <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono text-sm">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        Nama Kelas
                                                    </p>
                                                    <p className="font-bold text-gray-800 dark:text-gray-200">
                                                        {item.nama_kelas}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => openModal(item)}
                                                className="flex-1 flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-md transition text-sm"
                                            >
                                                <Pencil className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="flex-1 flex items-center justify-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-md transition text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL FORM - Responsive */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                                    {isEdit ? 'Edit Nama Kelas' : 'Tambah Kelas Baru'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded transition"
                                >
                                    <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nama Kelas
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600 px-4 py-2"
                                        placeholder="Contoh: X RPL 1"
                                        value={data.nama_kelas}
                                        onChange={e => setData('nama_kelas', e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSubmit(e);
                                        }}
                                        autoFocus
                                    />
                                    {errors.nama_kelas && (
                                        <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                                            {errors.nama_kelas}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="w-full sm:w-auto px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Simpan')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
