import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import {
    Plus, Search, FileText, Trash2, Download,
    Folder, X, CheckCircle, AlertCircle, File
} from 'lucide-react';

export default function BankSoalIndex({ auth, files, mapels }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- FORM HANDLER (Inertia useForm) ---
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        mapel_id: '',
        judul_soal: '',
        file_soal: null,
    });

    // Handle Submit Upload
    const submit = (e) => {
        e.preventDefault();
        post(route('guru.bank-soal.store'), {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    // Handle Delete File
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus berkas soal ini? Data yang dihapus tidak dapat dikembalikan.')) {
            destroy(route('guru.bank-soal.destroy', id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset(); // Reset form saat modal ditutup
    };

    // --- SEARCH FILTER (Client Side) ---
    const filteredFiles = files.filter(item =>
        item.judul_soal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mapel.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Ambil Flash Message dari Backend
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Bank Soal (Arsip Berkas)</h2>}
        >
            <Head title="Bank Soal Guru" />

            <div className="py-2">
                {/* --- FLASH MESSAGE --- */}
                {flash.message && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-auto max-w-7xl sm:px-6 lg:px-8 shadow-sm">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>{flash.message}</span>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- TOOLBAR (Search & Add Button) --- */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative w-full md:w-1/3">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                placeholder="Cari judul soal atau mapel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all text-sm font-medium"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Upload Berkas Soal
                        </button>
                    </div>

                    {/* --- CONTENT AREA --- */}
                    {filteredFiles.length === 0 ? (
                        // Empty State
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Belum ada berkas soal</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Silakan upload file soal (PDF/Word) untuk disimpan di Bank Soal.
                            </p>
                        </div>
                    ) : (
                        // File List Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFiles.map((file) => (
                                <div key={file.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between">

                                    {/* Card Header & Body */}
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                                {file.tipe_file || 'FILE'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight" title={file.judul_soal}>
                                            {file.judul_soal}
                                        </h3>

                                        <div className="mt-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                                {file.mapel.nama_mapel}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-400 mt-3 flex items-center">
                                            <span>Size: {file.ukuran_file}</span>
                                            <span className="mx-1">•</span>
                                            <span>{new Date(file.created_at).toLocaleDateString('id-ID')}</span>
                                        </p>
                                    </div>

                                    {/* Card Footer (Actions) */}
                                    <div className="bg-gray-50 dark:bg-gray-700/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                                        <a
                                            href={`/storage/${file.file_soal}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                        >
                                            <Download className="w-3 h-3 mr-1" />
                                            Unduh
                                        </a>

                                        <button
                                            onClick={() => handleDelete(file.id)}
                                            className="inline-flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-transparent rounded text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL UPLOAD FORM --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                            <Plus className="w-5 h-5 mr-2 text-blue-600" />
                            Upload Berkas Soal
                        </h2>
                        <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Pilih Mapel */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mata Pelajaran <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.mapel_id}
                                onChange={(e) => setData('mapel_id', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            >
                                <option value="">-- Pilih Mapel --</option>
                                {mapels.map((m) => (
                                    <option key={m.id} value={m.id}>{m.nama_mapel}</option>
                                ))}
                            </select>
                            {errors.mapel_id && <p className="text-red-500 text-xs mt-1">{errors.mapel_id}</p>}
                        </div>

                        {/* Judul Soal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Judul Dokumen <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.judul_soal}
                                onChange={(e) => setData('judul_soal', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                placeholder="Contoh: Soal UTS Semester Ganjil 2024"
                            />
                            {errors.judul_soal && <p className="text-red-500 text-xs mt-1">{errors.judul_soal}</p>}
                        </div>

                        {/* Upload File */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                File Dokumen <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="space-y-1 text-center">
                                    <File className="mx-auto h-10 w-10 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2">
                                            <span>Pilih file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) => setData('file_soal', e.target.files[0])}
                                                accept=".pdf,.doc,.docx"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX (Max 10MB)</p>
                                    {data.file_soal && (
                                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            {data.file_soal.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.file_soal && <p className="text-red-500 text-xs mt-1">{errors.file_soal}</p>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 font-medium text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 font-medium text-sm disabled:opacity-50 flex items-center"
                        >
                            {processing ? 'Mengupload...' : 'Simpan Berkas'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
