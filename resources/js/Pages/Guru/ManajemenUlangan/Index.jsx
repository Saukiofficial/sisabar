import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import {
    Plus, Search, Calendar, Clock, RefreshCw, Trash2,
    CheckCircle, X, AlertCircle, Key, Users, BookOpen
} from 'lucide-react';

export default function ManajemenUlanganIndex({ auth, jadwals, paket_soals, kelas_list }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- FORM HANDLER (Buat Jadwal Baru) ---
    const { data, setData, post, processing, errors, reset } = useForm({
        ujian_id: '',
        kelas_id: '',
        nama_ujian: '',
        waktu_mulai: '',
        waktu_selesai: '',
        durasi_menit: 60,
    });

    // Otomatis isi nama ujian & durasi saat paket soal dipilih
    const handlePaketChange = (e) => {
        const selectedId = e.target.value;
        const paket = paket_soals.find(p => p.id == selectedId);

        setData(prev => ({
            ...prev,
            ujian_id: selectedId,
            nama_ujian: paket ? paket.judul : prev.nama_ujian,
            durasi_menit: paket ? paket.durasi_menit : prev.durasi_menit
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('guru.ulangan.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin membatalkan/menghapus jadwal ujian ini?')) {
            router.delete(route('guru.ulangan.destroy', id));
        }
    };

    const handleResetToken = (id) => {
        if (confirm('Generate token baru untuk ujian ini? Token lama tidak akan berlaku lagi.')) {
            router.put(route('guru.ulangan.token', id), {}, {
                preserveScroll: true
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    // Filter Client Side
    const filteredJadwals = jadwals.filter(item =>
        item.nama_ujian.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kelas.nama_kelas.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { flash } = usePage().props;

    // Helper: Format Tanggal & Jam
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Jadwal Pelaksanaan Ujian</h2>}
        >
            <Head title="Jadwal Ulangan" />

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
                                placeholder="Cari jadwal atau kelas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-medium text-sm"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Tambah Jadwal Baru
                        </button>
                    </div>

                    {/* LIST JADWAL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJadwals.length === 0 ? (
                            <div className="col-span-full text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
                                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <h3 className="text-gray-900 dark:text-white font-medium">Belum ada jadwal ujian</h3>
                                <p className="text-gray-500 text-sm">Silakan buat jadwal pelaksanaan ujian baru.</p>
                            </div>
                        ) : (
                            filteredJadwals.map((jadwal) => (
                                <div key={jadwal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition flex flex-col justify-between relative overflow-hidden">
                                    {/* Status Badge */}
                                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${jadwal.status === 'Berlangsung' ? 'bg-green-500 text-white animate-pulse' : (jadwal.status === 'Selesai' ? 'bg-gray-500 text-white' : 'bg-yellow-500 text-white')}`}>
                                        {jadwal.status}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                            {jadwal.nama_ujian}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {jadwal.kelas.nama_kelas}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" /> {jadwal.ujian?.judul || 'Paket Dihapus'}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
                                            <div className="flex justify-between">
                                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Mulai:</span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">{formatDateTime(jadwal.waktu_mulai)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Selesai:</span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">{formatDateTime(jadwal.waktu_selesai)}</span>
                                            </div>
                                        </div>

                                        {/* Token Display */}
                                        <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                                <Key className="w-5 h-5" />
                                                <span className="text-xs font-bold uppercase">Token Masuk</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-mono font-bold tracking-widest text-blue-800 dark:text-blue-200 select-all">
                                                    {jadwal.token_ujian}
                                                </span>
                                                <button
                                                    onClick={() => handleResetToken(jadwal.id)}
                                                    className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition"
                                                    title="Reset Token"
                                                >
                                                    <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Durasi: {jadwal.durasi_menit} Menit</span>
                                        <button
                                            onClick={() => handleDelete(jadwal.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 hover:underline"
                                        >
                                            <Trash2 className="w-4 h-4" /> Hapus Jadwal
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH JADWAL */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Jadwalkan Ujian Baru</h2>
                        <button type="button" onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
                    </div>

                    <div className="space-y-4">
                        {/* Pilih Paket Soal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Paket Soal (Terbit)</label>
                            <select
                                value={data.ujian_id}
                                onChange={handlePaketChange}
                                className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white"
                            >
                                <option value="">-- Pilih Paket Soal --</option>
                                {paket_soals.map(p => (
                                    <option key={p.id} value={p.id}>{p.judul} ({p.mapel?.nama_mapel})</option>
                                ))}
                            </select>
                            {errors.ujian_id && <p className="text-red-500 text-xs mt-1">{errors.ujian_id}</p>}
                            <p className="text-xs text-gray-500 mt-1">*Hanya paket soal dengan status 'Terbit' yang muncul.</p>
                        </div>

                        {/* Nama Jadwal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Jadwal Ujian</label>
                            <input
                                type="text"
                                value={data.nama_ujian}
                                onChange={e => setData('nama_ujian', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white"
                                placeholder="Contoh: UAS Matematika X-RPL 1"
                            />
                            {errors.nama_ujian && <p className="text-red-500 text-xs mt-1">{errors.nama_ujian}</p>}
                        </div>

                        {/* Kelas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas Peserta</label>
                            <select
                                value={data.kelas_id}
                                onChange={e => setData('kelas_id', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white"
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {kelas_list.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                                ))}
                            </select>
                            {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                        </div>

                        {/* Waktu Pelaksanaan */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Waktu Mulai</label>
                                <input
                                    type="datetime-local"
                                    value={data.waktu_mulai}
                                    onChange={e => setData('waktu_mulai', e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white"
                                />
                                {errors.waktu_mulai && <p className="text-red-500 text-xs mt-1">{errors.waktu_mulai}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Waktu Selesai</label>
                                <input
                                    type="datetime-local"
                                    value={data.waktu_selesai}
                                    onChange={e => setData('waktu_selesai', e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white"
                                />
                                {errors.waktu_selesai && <p className="text-red-500 text-xs mt-1">{errors.waktu_selesai}</p>}
                            </div>
                        </div>

                        {/* Durasi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durasi Pengerjaan (Menit)</label>
                            <input
                                type="number"
                                value={data.durasi_menit}
                                onChange={e => setData('durasi_menit', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:bg-gray-900 dark:text-white"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm">Batal</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">{processing ? 'Menyimpan...' : 'Simpan Jadwal'}</button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
