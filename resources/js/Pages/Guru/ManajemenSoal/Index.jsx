import React, { useState } from 'react';
// UBAH: Gunakan path alias '@' jika disupport oleh vite config Anda, atau sesuaikan path relatif
// Asumsi: AuthenticatedLayout ada di folder Layouts sejajar dengan Pages
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import {
    Plus, Search, FileText, Calendar, Clock, Edit, Trash2,
    CheckCircle, X, AlertCircle, Eye, BookOpen
} from 'lucide-react';

export default function ManajemenSoalIndex({ auth, ujians, mapels, kelas_list }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- FORM HANDLER (Buat Paket Ujian) ---
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        judul: '',
        mapel_id: '',
        kelas_id: '',
        jenis_soal: 'Pilihan Ganda',
        tanggal_ujian: '',
        durasi_menit: 60,
        status: 'Draft',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('guru.ujian.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus paket ujian ini beserta seluruh soal di dalamnya?')) {
            destroy(route('guru.ujian.destroy', id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    // Filter Client Side
    const filteredUjians = ujians.filter(item =>
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mapel.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manajemen Ulangan & Ujian</h2>}
        >
            <Head title="Manajemen Soal" />

            <div className="py-2">
                {flash.message && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex items-center"><CheckCircle className="h-5 w-5 mr-2" /><span>{flash.message}</span></div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* TOOLBAR */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                className="pl-9 w-full rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                placeholder="Cari ujian..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-medium text-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Buat Paket Ujian
                        </button>
                    </div>

                    {/* LIST UJIAN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUjians.length === 0 ? (
                            <div className="col-span-full text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <h3 className="text-gray-900 dark:text-white font-medium">Belum ada paket ujian</h3>
                                <p className="text-gray-500 text-sm">Buat paket ujian baru untuk memulai.</p>
                            </div>
                        ) : (
                            filteredUjians.map((ujian) => (
                                <div key={ujian.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition flex flex-col justify-between relative overflow-hidden">
                                    {/* Status Badge */}
                                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${ujian.status === 'Terbit' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                        {ujian.status}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded border border-blue-200">
                                                {ujian.mapel.nama_mapel}
                                            </span>
                                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded border border-purple-200">
                                                {ujian.kelas.nama_kelas}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {ujian.judul}
                                        </h3>

                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>{new Date(ujian.tanggal_ujian).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>{ujian.durasi_menit} Menit</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                                <span>{ujian.soals_count || 0} Butir Soal</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                                            {ujian.jenis_soal}
                                        </span>
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('guru.ujian.edit', ujian.id)}
                                                className="p-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 hover:text-blue-600 transition"
                                                title="Kelola Soal"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(ujian.id)}
                                                className="p-2 bg-white border border-gray-300 text-red-600 rounded hover:bg-red-50 transition"
                                                title="Hapus Paket"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL BUAT PAKET UJIAN */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Buat Paket Ujian Baru</h2>
                        <button type="button" onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Ujian</label>
                            <input type="text" value={data.judul} onChange={e => setData('judul', e.target.value)} className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white" placeholder="Contoh: UTS Matematika Ganjil" />
                            {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mata Pelajaran</label>
                                <select value={data.mapel_id} onChange={e => setData('mapel_id', e.target.value)} className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white">
                                    <option value="">-- Pilih Mapel --</option>
                                    {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                </select>
                                {errors.mapel_id && <p className="text-red-500 text-xs mt-1">{errors.mapel_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
                                <select value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)} className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white">
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelas_list.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                </select>
                                {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Soal</label>
                                <select value={data.jenis_soal} onChange={e => setData('jenis_soal', e.target.value)} className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white">
                                    <option value="Pilihan Ganda">Pilihan Ganda</option>
                                    <option value="Uraian">Uraian</option>
                                    <option value="Campuran">Campuran (PG + Uraian)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Publikasi</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white">
                                    <option value="Draft">Draft (Disimpan dulu)</option>
                                    <option value="Terbit">Terbit (Siap dikerjakan)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Ujian</label>
                                <input type="date" value={data.tanggal_ujian} onChange={e => setData('tanggal_ujian', e.target.value)} className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white" />
                                {errors.tanggal_ujian && <p className="text-red-500 text-xs mt-1">{errors.tanggal_ujian}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durasi (Menit)</label>
                                <input type="number" value={data.durasi_menit} onChange={e => setData('durasi_menit', e.target.value)} className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm">Batal</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">{processing ? 'Menyimpan...' : 'Simpan Paket'}</button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
