import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import {
    Search, Trash2, Download, User, BookOpen,
    AlertCircle, CheckCircle, FileText, Filter
} from 'lucide-react';

// Komponen Pagination Sederhana
const Pagination = ({ links }) => {
    return (
        <div className="flex flex-wrap justify-center gap-1 mt-6">
            {links.map((link, key) => (
                link.url ? (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                            link.active
                                ? 'bg-blue-600 text-white border border-blue-600'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={key}
                        className="px-3 py-1 text-sm text-gray-400 border border-gray-200 rounded dark:border-gray-700 dark:text-gray-600"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
};

export default function AdminBankSoalIndex({ auth, files, mapels, gurus, filters }) {
    // State untuk filter
    const [search, setSearch] = useState(filters.search || '');
    const [guruId, setGuruId] = useState(filters.guru_id || '');
    const [mapelId, setMapelId] = useState(filters.mapel_id || '');

    // Fungsi Filter Otomatis (Debounce Search)
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.bank-soal.index'),
                {
                    search: search,
                    guru_id: guruId,
                    mapel_id: mapelId
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                }
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [search, guruId, mapelId]);

    // Handle Delete
    const handleDelete = (id) => {
        if (confirm('PERINGATAN ADMIN: Hapus berkas soal ini secara permanen?')) {
            router.delete(route('admin.bank-soal.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Ambil flash message dengan aman
    const { props } = usePage();
    const flash = props.flash || {};

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Monitoring Bank Soal Guru</h2>}
        >
            <Head title="Monitoring Bank Soal" />

            <div className="py-2">
                {/* Flash Message */}
                {flash.message && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>{flash.message}</span>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- FILTER BAR --- */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center border border-gray-100 dark:border-gray-700">

                        {/* 1. Search Box */}
                        <div className="relative w-full md:w-1/3">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Cari Judul Soal</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full p-2 pl-9 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Ketik judul berkas..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* 2. Filter Guru */}
                        <div className="w-full md:w-1/4">
                             <label className="text-xs font-medium text-gray-500 mb-1 block">Filter Guru</label>
                            <select
                                value={guruId}
                                onChange={(e) => setGuruId(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500"
                            >
                                <option value="">Semua Guru</option>
                                {gurus.map(g => (
                                    <option key={g.id} value={g.id}>{g.user.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Filter Mapel */}
                        <div className="w-full md:w-1/4">
                             <label className="text-xs font-medium text-gray-500 mb-1 block">Filter Mapel</label>
                            <select
                                value={mapelId}
                                onChange={(e) => setMapelId(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500"
                            >
                                <option value="">Semua Mapel</option>
                                {mapels.map(m => (
                                    <option key={m.id} value={m.id}>{m.nama_mapel}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- INFO TOTAL DATA --- */}
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-right">
                        Menampilkan {files.data.length} dari total {files.total} berkas
                    </div>

                    {/* --- LIST FILES --- */}
                    <div className="space-y-4">
                        {files.data.length === 0 ? (
                            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                                <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <h3 className="text-gray-900 dark:text-white font-medium">Data tidak ditemukan</h3>
                                <p className="text-gray-500 text-sm">Belum ada berkas soal yang sesuai filter pencarian Anda.</p>
                            </div>
                        ) : (
                            files.data.map((file) => (
                                <div key={file.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative">

                                    <div className="flex flex-col md:flex-row gap-6 items-center">

                                        {/* Kiri: Icon File */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                        </div>

                                        {/* Tengah: Info File */}
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {file.judul_soal}
                                            </h3>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {file.guru?.user?.name || 'Guru Dihapus'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4 text-orange-500" />
                                                    <span>{file.mapel?.nama_mapel}</span>
                                                </div>
                                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs uppercase font-mono">
                                                    {file.tipe_file || 'FILE'}
                                                </span>
                                                <span className="text-xs">
                                                    {file.ukuran_file}
                                                </span>
                                                <span className="text-xs">
                                                    Diupload: {new Date(file.created_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Kanan: Tombol Aksi */}
                                        <div className="flex gap-2 w-full md:w-auto justify-center">
                                            <a
                                                href={`/storage/${file.file_soal}`}
                                                target="_blank"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-medium"
                                            >
                                                <Download className="w-4 h-4" />
                                                Unduh
                                            </a>

                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition shadow-sm text-sm font-medium"
                                                title="Hapus Paksa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* --- PAGINATION --- */}
                    <Pagination links={files.links} />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
