import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Send, Clock, CheckCircle, AlertCircle, ArrowLeft, Calendar, XCircle
} from 'lucide-react';

export default function PengajuanIzin({ auth, history }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        jenis: 'Sakit',
        tanggal_mulai: '',
        tanggal_selesai: '',
        keterangan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('siswa.izin.store'), {
            onSuccess: () => reset(),
        });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Disetujui':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1"><CheckCircle size={12}/> Disetujui</span>;
            case 'Ditolak':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1"><XCircle size={12}/> Ditolak</span>;
            default:
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 flex items-center gap-1"><Clock size={12}/> Menunggu Verifikasi</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Pengajuan Izin
                    </h2>
                    <Link href={route('siswa.dashboard')} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <ArrowLeft size={16} /> Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Pengajuan Izin" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- FORMULIR (KIRI) --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Send size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Formulir Baru</h3>
                                    <p className="text-xs text-gray-500">Isi data dengan benar.</p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Pengajuan</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Sakit', 'Izin', 'Lainnya'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setData('jenis', type)}
                                                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                                                    data.jenis === type
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.jenis && <div className="text-red-500 text-xs mt-1">{errors.jenis}</div>}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Mulai Tanggal</label>
                                        <input
                                            type="date"
                                            className="w-full mt-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                            value={data.tanggal_mulai}
                                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        />
                                        {errors.tanggal_mulai && <div className="text-red-500 text-xs mt-1">{errors.tanggal_mulai}</div>}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Sampai Tanggal</label>
                                        <input
                                            type="date"
                                            className="w-full mt-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                            value={data.tanggal_selesai}
                                            onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alasan / Keterangan</label>
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl p-3 min-h-[100px] text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                        placeholder="Jelaskan alasan Anda..."
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                    ></textarea>
                                    {errors.keterangan && <div className="text-red-500 text-xs mt-1">{errors.keterangan}</div>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                </button>
                            </form>

                            {recentlySuccessful && (
                                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2 border border-green-100">
                                    <CheckCircle size={16} /> Terkirim! Menunggu verifikasi admin.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIWAYAT (KANAN) --- */}
                    <div className="lg:col-span-2">
                         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
                                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Clock size={18} className="text-gray-400"/> Riwayat Pengajuan
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {history && history.length > 0 ? history.map((item) => (
                                    <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 dark:text-white text-sm">{item.jenis}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.tanggal_mulai} s/d {item.tanggal_selesai}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <div className="ml-13 pl-13 mt-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700 italic">
                                                "{item.keterangan}"
                                            </p>
                                            <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                                                Diajukan pada: {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-gray-400">
                                        <AlertCircle size={40} className="mx-auto mb-3 opacity-20"/>
                                        <p>Belum ada riwayat pengajuan.</p>
                                    </div>
                                )}
                            </div>
                         </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
