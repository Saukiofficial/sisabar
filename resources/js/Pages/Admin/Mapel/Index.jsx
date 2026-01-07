import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, BookOpen, X } from 'lucide-react';

export default function MapelIndex({ auth, mapel }) {
    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        id: '',
        nama_mapel: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('mapels.update', data.id), { onSuccess: () => closeModal() });
        } else {
            post(route('mapels.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus mata pelajaran ini?')) {
            destroy(route('mapels.destroy', id));
        }
    };

    const openModal = (item = null) => {
        setIsEdit(!!item);
        setData({
            id: item ? item.id : '',
            nama_mapel: item ? item.nama_mapel : ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
                    Mata Pelajaran
                </h2>
            }
        >
            <Head title="Data Mapel" />

            <div className="py-6 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Daftar Mata Pelajaran
                    </h3>
                    <button
                        onClick={() => openModal()}
                        className="w-full sm:w-auto flex items-center justify-center bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Mapel
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {mapel.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
                                Belum ada data mata pelajaran.
                            </p>
                        ) : (
                            mapel.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/30 transition bg-white dark:bg-gray-800 flex justify-between items-center group"
                                >
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full text-purple-600 dark:text-purple-400 flex-shrink-0">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                            {item.nama_mapel}
                                        </span>
                                    </div>
                                    <div className="flex space-x-1 ml-2 flex-shrink-0">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded transition"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded transition"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {isEdit ? 'Edit Mapel' : 'Tambah Mapel'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nama Mata Pelajaran
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
                                    value={data.nama_mapel}
                                    onChange={e => setData('nama_mapel', e.target.value)}
                                    placeholder="Contoh: Matematika Wajib"
                                    autoFocus
                                    required
                                />
                                {errors.nama_mapel && (
                                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                                        {errors.nama_mapel}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition shadow-md disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
