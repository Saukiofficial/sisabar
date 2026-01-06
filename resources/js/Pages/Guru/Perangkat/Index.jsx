import React, { useState } from 'react';
// PERBAIKAN IMPORT PATH: Menggunakan path relatif ../../../ sesuai struktur file Anda
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Modal from '../../../Components/Modal';
import {
    Plus, Search, FileText, Trash2, Download,
    Folder, X, AlertCircle, CheckCircle, Clock, Printer
} from 'lucide-react';

export default function PerangkatIndex({ auth, perangkats, mapels, jenis_list }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- FORM HANDLER ---
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        mapel_id: '',
        jenis_perangkat: '',
        judul: '',
        keterangan: '',
        file_file: null, // Sesuai dengan validasi di Controller
    });

    // Handle Submit Upload
    const submit = (e) => {
        e.preventDefault();
        post(route('guru.perangkat.store'), {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    // Handle Delete
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus file ini?')) {
            destroy(route('guru.perangkat.destroy', id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset(); // Bersihkan form saat modal ditutup
    };

    // --- SEARCH FILTER ---
    // Pastikan 'perangkats' tidak undefined sebelum di-filter
    const safePerangkats = Array.isArray(perangkats) ? perangkats : [];

    const filteredPerangkats = safePerangkats.filter(item =>
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jenis_perangkat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mapel && item.mapel.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Ambil Flash Message
    const { flash } = usePage().props;

    // Helper: Badge Status
    const renderStatusBadge = (status) => {
        switch(status) {
            case 'Valid':
                return (
                    <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> Valid
                    </span>
                );
            case 'Revisi':
                return (
                    <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-1" /> Perlu Revisi
                    </span>
                );
            default: // Menunggu
                return (
                    <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" /> Menunggu
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Perangkat Pembelajaran</h2>}
        >
            <Head title="Perangkat Pembelajaran" />

            <div className="py-6">
                {/* --- FLASH MESSAGE --- */}
                {flash.message && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm max-w-7xl mx-auto sm:px-6 lg:px-8 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">{flash.message}</span>
                    </div>
                )}

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- ACTION BAR --- */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative w-full md:w-1/3">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white shadow-sm"
                                placeholder="Cari file, mapel, atau jenis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all text-sm font-medium"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Upload Berkas
                        </button>
                    </div>

                    {/* --- EMPTY STATE --- */}
                    {filteredPerangkats.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                            <Folder className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Belum ada berkas</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Upload RPP, Silabus, atau Modul Ajar Anda untuk divalidasi Kepala Sekolah.</p>
                        </div>
                    )}

                    {/* --- CARD LIST GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPerangkats.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between overflow-hidden">
                                <div className="p-5">
                                    {/* Header Card: Jenis & Status */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                {item.jenis_perangkat}
                                            </span>
                                        </div>
                                        {renderStatusBadge(item.status)}
                                    </div>

                                    {/* Content Card */}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight min-h-[3rem]" title={item.judul}>
                                        {item.judul}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                                            {item.mapel ? item.mapel.nama_mapel : 'Mapel Umum'}
                                        </span>
                                    </div>

                                    {item.keterangan && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 italic">
                                            "{item.keterangan}"
                                        </p>
                                    )}

                                    {/* Alert Khusus Status Revisi */}
                                    {item.status === 'Revisi' && item.catatan_revisi && (
                                        <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md p-3">
                                            <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1"/> Catatan Revisi:
                                            </p>
                                            <p className="text-xs text-red-600 dark:text-red-300">
                                                {item.catatan_revisi}
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-400 mt-4 border-t pt-3 dark:border-gray-700">
                                        Diupload: {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                    </p>
                                </div>

                                {/* Footer Actions */}
                                <div className="bg-gray-50 dark:bg-gray-700/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                                    <div className="flex gap-2">
                                        <a
                                            href={`/storage/${item.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                            title="Lihat File"
                                        >
                                            <Download className="w-3.5 h-3.5 mr-1" />
                                            Unduh
                                        </a>

                                        {/* Tombol Hapus hanya jika belum Valid (opsional, sesuaikan kebutuhan) */}
                                        {item.status !== 'Valid' && (
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                Hapus
                                            </button>
                                        )}
                                    </div>

                                    {/* TOMBOL CETAK BUKTI (Hanya muncul jika Valid) */}
                                    {item.status === 'Valid' && (
                                        <a
                                            href={route('guru.perangkat.cetak', item.id)} // Pastikan route ini ada
                                            target="_blank"
                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition shadow-sm ml-auto"
                                        >
                                            <Printer className="w-3.5 h-3.5 mr-1" />
                                            Cetak Pengesahan
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <Plus className="w-5 h-5 mr-2 text-blue-600" />
                            Upload Dokumen Baru
                        </h2>
                        <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-500 transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Mapel & Jenis (Grid 2 Kolom) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mata Pelajaran <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.mapel_id}
                                    onChange={(e) => setData('mapel_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                                >
                                    <option value="">-- Pilih Mapel --</option>
                                    {mapels.map((m) => (
                                        <option key={m.id} value={m.id}>{m.nama_mapel}</option>
                                    ))}
                                </select>
                                {errors.mapel_id && <p className="text-red-500 text-xs mt-1">{errors.mapel_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Jenis Dokumen <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.jenis_perangkat}
                                    onChange={(e) => setData('jenis_perangkat', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                                >
                                    <option value="">-- Pilih Jenis --</option>
                                    {jenis_list.map((jenis, index) => (
                                        <option key={index} value={jenis}>{jenis}</option>
                                    ))}
                                </select>
                                {errors.jenis_perangkat && <p className="text-red-500 text-xs mt-1">{errors.jenis_perangkat}</p>}
                            </div>
                        </div>

                        {/* Judul */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Judul Dokumen <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                                placeholder="Contoh: Modul Ajar Matematika Kelas X Bab 1"
                            />
                            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                File Dokumen (PDF/DOC) <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer relative">
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setData('file_file', e.target.files[0])}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                />
                                <div className="space-y-1 text-center pointer-events-none">
                                    <FileText className="mx-auto h-10 w-10 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                        <span className="font-medium text-blue-600 hover:text-blue-500">
                                            Klik untuk upload
                                        </span>
                                        <span className="pl-1">atau drag & drop</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, Office, ZIP (Max 10MB)</p>

                                    {data.file_file && (
                                        <div className="mt-3 flex items-center justify-center text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                                            <CheckCircle className="w-4 h-4 mr-1"/>
                                            {data.file_file.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.file_file && <p className="text-red-500 text-xs mt-1">{errors.file_file}</p>}
                        </div>

                        {/* Keterangan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Keterangan Tambahan (Opsional)
                            </label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                rows="2"
                                placeholder="Pesan untuk Kepala Sekolah..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 font-medium text-sm transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mengupload...
                                </>
                            ) : (
                                'Simpan & Upload'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
