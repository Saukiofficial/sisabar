import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, BookOpen } from 'lucide-react';

export default function MapelIndex({ auth, mapel }) {
    // Note: Controller passing prop name as 'mapel', so we use that.
    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        id: '',
        nama_mapel: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('mapels.update', data.id), { onSuccess: () => closeModal() });
        } else {
            post(route('mapels.store'), { onSuccess: () => closeModal() });
        }
    };

    // Handle Delete
    const handleDelete = (id) => {
        if (confirm('Hapus mata pelajaran ini?')) {
            destroy(route('mapels.destroy', id));
        }
    };

    // Modal Logic
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
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Mata Pelajaran</h2>}>
            <Head title="Data Mapel" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Daftar Mata Pelajaran</h3>
                    <button onClick={() => openModal()} className="flex items-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Mapel
                    </button>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mapel.length === 0 ? (
                            <p className="text-gray-500 col-span-full text-center py-4">Belum ada data mata pelajaran.</p>
                        ) : (
                            mapel.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition bg-white flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-gray-800">{item.nama_mapel}</span>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button onClick={() => openModal(item)} className="text-gray-500 hover:text-blue-600 p-1">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-600 p-1">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isEdit ? 'Edit Mapel' : 'Tambah Mapel'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Pelajaran</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                    value={data.nama_mapel}
                                    onChange={e => setData('nama_mapel', e.target.value)}
                                    placeholder="Contoh: Matematika Wajib"
                                    autoFocus
                                />
                                {errors.nama_mapel && <p className="text-red-500 text-xs mt-1">{errors.nama_mapel}</p>}
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
