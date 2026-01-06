import React, { useEffect } from 'react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
// Pastikan menggunakan @inertiajs/react sesuai versi terbaru Anda
import { useForm, usePage, Head } from '@inertiajs/react';
import { Key, AlertCircle, Clock, BookOpen, Calendar, User } from 'lucide-react';

export default function PersiapanUjian({ auth, jadwal }) {
    const { data, setData, post, processing, errors } = useForm({
        token: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('siswa.ujian.mulai', jadwal.id));
    };

    const { flash } = usePage().props;

    // --- GUARD CLAUSE ---
    // Mencegah blank screen jika data jadwal null/undefined
    if (!jadwal) {
        return <div className="p-10 text-center">Memuat data ujian...</div>;
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Konfirmasi Ujian</h2>}
        >
            <Head title="Persiapan Ujian" />

            <div className="py-12 max-w-xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">

                    {/* Hiasan Background */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {jadwal?.nama_ujian || 'Ujian Tanpa Nama'}
                    </h3>

                    <div className="flex justify-center items-center gap-2 mb-6">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {jadwal?.ujian?.mapel?.nama_mapel || '-'}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {jadwal?.durasi_menit || 0} Menit
                        </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6 text-sm text-gray-600 dark:text-gray-300 text-left space-y-2 border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2"><User className="w-3 h-3" /> Guru Pengampu:</span>
                            {/* PERBAIKAN UTAMA: Menggunakan ?. agar tidak crash jika data guru tidak di-load */}
                            <span className="font-semibold">
                                {jadwal?.guru?.user?.name || 'Data Guru Tidak Dimuat'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu Mulai:</span>
                            <span className="font-semibold">
                                {jadwal?.waktu_mulai ? new Date(jadwal.waktu_mulai).toLocaleString('id-ID') : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu Selesai:</span>
                            <span className="font-semibold">
                                {jadwal?.waktu_selesai ? new Date(jadwal.waktu_selesai).toLocaleString('id-ID') : '-'}
                            </span>
                        </div>
                    </div>

                    {/* Alert Error Token */}
                    {flash?.error && (
                        <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-center gap-2 animate-pulse">
                            <AlertCircle className="w-4 h-4" /> {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="text-left">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Masukkan Token Ujian
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="text-gray-400 w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg uppercase font-mono tracking-[0.2em] text-center text-2xl py-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="TOKEN"
                                    value={data.token}
                                    onChange={e => setData('token', e.target.value.toUpperCase())}
                                    maxLength={5}
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.token && <p className="text-red-500 text-xs mt-1">{errors.token}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                *Token diberikan oleh guru pengawas saat ujian dimulai.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {processing ? 'Memverifikasi...' : 'MULAI MENGERJAKAN'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
