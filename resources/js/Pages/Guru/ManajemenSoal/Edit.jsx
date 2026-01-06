import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, Plus, Trash2, CheckCircle, Save, FileText, Send, XCircle
} from 'lucide-react';

export default function ManajemenSoalEdit({ auth, ujian, soals }) {
    // State lokal untuk mengatur tampilan form berdasarkan tipe soal
    const [tipeInput, setTipeInput] = useState('Pilihan Ganda');

    // --- FORM HANDLER (Tambah Butir Soal) ---
    const { data, setData, post, processing, errors, reset } = useForm({
        tipe: 'Pilihan Ganda',
        pertanyaan: '',
        opsi_a: '',
        opsi_b: '',
        opsi_c: '',
        opsi_d: '',
        opsi_e: '',
        kunci_jawaban: '',
        bobot: 1,
    });

    // Reset form saat ganti tipe soal agar inputan bersih
    const handleTipeChange = (e) => {
        const newTipe = e.target.value;
        setTipeInput(newTipe);
        setData(prev => ({
            ...prev,
            tipe: newTipe,
            opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', opsi_e: '',
            kunci_jawaban: '' // Reset kunci
        }));
    };

    const submitSoal = (e) => {
        e.preventDefault();
        post(route('guru.ujian.soal.store', ujian.id), {
            onSuccess: () => {
                reset();
                // Kembalikan tipe ke default atau biarkan, di sini kita reset data tapi tipe tetap
                setData('tipe', tipeInput);
            },
            preserveScroll: true
        });
    };

    const deleteSoal = (id) => {
        if (confirm('Hapus butir soal ini?')) {
            router.delete(route('guru.ujian.soal.destroy', id), {
                preserveScroll: true
            });
        }
    };

    // --- FUNGSI UPDATE STATUS (PUBLISH / DRAFT) ---
    const updateStatus = (newStatus) => {
        const message = newStatus === 'Terbit'
            ? 'Terbitkan ujian ini? Siswa akan dapat melihat dan mengerjakannya.'
            : 'Kembalikan ke Draft? Ujian akan disembunyikan dari siswa.';

        if (confirm(message)) {
            router.put(route('guru.ujian.update', ujian.id), {
                status: newStatus
            }, {
                preserveScroll: true
            });
        }
    };

    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Judul & Navigasi */}
                    <div className="flex items-center gap-4">
                        <Link href={route('guru.ujian.index')} className="text-gray-500 hover:text-gray-700 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                {ujian.judul}
                            </h2>
                            <div className="flex items-center gap-2 text-sm mt-1">
                                <span className="text-gray-500">Status:</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${ujian.status === 'Terbit' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {ujian.status}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500">{ujian.jenis_soal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi Publikasi */}
                    <div>
                        {ujian.status === 'Draft' ? (
                            <button
                                onClick={() => updateStatus('Terbit')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm text-sm font-bold"
                            >
                                <Send className="w-4 h-4 mr-2" /> Terbitkan Ujian
                            </button>
                        ) : (
                            <button
                                onClick={() => updateStatus('Draft')}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition shadow-sm text-sm font-medium"
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Tarik ke Draft
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Kelola Soal - ${ujian.judul}`} />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Flash Message */}
                {flash.message && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center shadow-sm">
                        <CheckCircle className="h-5 w-5 mr-2" /> {flash.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- KOLOM KIRI: FORM INPUT SOAL --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2 border-b pb-3 dark:border-gray-700">
                                <Plus className="w-5 h-5 text-blue-600" /> Tambah Butir Soal
                            </h3>

                            <form onSubmit={submitSoal} className="space-y-5">
                                {/* Pilihan Tipe Soal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe Soal</label>
                                    <select
                                        value={data.tipe}
                                        onChange={handleTipeChange}
                                        className="w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Pilihan Ganda">Pilihan Ganda</option>
                                        <option value="Uraian">Uraian</option>
                                    </select>
                                </div>

                                {/* Pertanyaan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pertanyaan</label>
                                    <textarea
                                        rows="4"
                                        value={data.pertanyaan}
                                        onChange={e => setData('pertanyaan', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tuliskan isi pertanyaan..."
                                    ></textarea>
                                    {errors.pertanyaan && <p className="text-red-500 text-xs mt-1">{errors.pertanyaan}</p>}
                                </div>

                                {/* Area Opsi Jawaban (Khusus PG) */}
                                {data.tipe === 'Pilihan Ganda' && (
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700 space-y-3">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Opsi Jawaban</p>
                                        {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                                            <div key={opt} className="flex gap-2 items-center">
                                                <span className="uppercase font-bold text-gray-400 w-5 text-xs text-center">{opt}</span>
                                                <input
                                                    type="text"
                                                    value={data[`opsi_${opt}`]}
                                                    onChange={e => setData(`opsi_${opt}`, e.target.value)}
                                                    className="flex-1 rounded-md border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm py-1.5 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={`Isi Opsi ${opt.toUpperCase()}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Kunci Jawaban */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kunci Jawaban</label>
                                    {data.tipe === 'Pilihan Ganda' ? (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {['A', 'B', 'C', 'D', 'E'].map(key => (
                                                <label key={key} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="kunci"
                                                        value={key}
                                                        checked={data.kunci_jawaban === key}
                                                        onChange={e => setData('kunci_jawaban', e.target.value)}
                                                        className="peer sr-only"
                                                    />
                                                    <span className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-600 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                                                        {key}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            rows="2"
                                            value={data.kunci_jawaban}
                                            onChange={e => setData('kunci_jawaban', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Tuliskan kata kunci jawaban uraian..."
                                        ></textarea>
                                    )}
                                    {errors.kunci_jawaban && <p className="text-red-500 text-xs mt-1">{errors.kunci_jawaban}</p>}
                                </div>

                                {/* Bobot */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bobot Nilai</label>
                                    <input
                                        type="number"
                                        value={data.bobot}
                                        onChange={e => setData('bobot', e.target.value)}
                                        className="w-24 rounded-lg border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Nilai poin untuk soal ini.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Soal'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: DAFTAR SOAL --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-2">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Daftar Soal</h3>
                                <p className="text-sm text-gray-500">Total: {soals.length} soal</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                                Total Bobot: {soals.reduce((sum, s) => sum + parseInt(s.bobot), 0)}
                            </div>
                        </div>

                        {soals.length === 0 ? (
                            <div className="text-center p-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-700">
                                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Belum ada soal</h3>
                                <p className="text-gray-500 dark:text-gray-400">Silakan tambahkan butir soal menggunakan formulir di sebelah kiri.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {soals.map((soal, index) => (
                                    <div key={soal.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative group hover:shadow-md transition-shadow">
                                        {/* Header Soal */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shadow-sm">
                                                    {index + 1}
                                                </span>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${soal.tipe === 'Pilihan Ganda' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                                                    {soal.tipe}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                    Bobot: {soal.bobot}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteSoal(soal.id)}
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Hapus Soal"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Pertanyaan */}
                                        <div className="ml-11">
                                            <p className="text-gray-800 dark:text-gray-200 font-medium text-base whitespace-pre-wrap mb-4">
                                                {soal.pertanyaan}
                                            </p>

                                            {/* Area Jawaban */}
                                            {soal.tipe === 'Pilihan Ganda' ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                    {['a', 'b', 'c', 'd', 'e'].map(opt => (
                                                        soal[`opsi_${opt}`] && (
                                                            <div
                                                                key={opt}
                                                                className={`flex gap-3 p-3 rounded-lg border transition-colors ${
                                                                    soal.kunci_jawaban === opt.toUpperCase()
                                                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                                                    : 'bg-gray-50 border-transparent dark:bg-gray-700/50'
                                                                }`}
                                                            >
                                                                <span className={`font-bold ${soal.kunci_jawaban === opt.toUpperCase() ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                                                    {opt.toUpperCase()}.
                                                                </span>
                                                                <span className="text-gray-700 dark:text-gray-300">{soal[`opsi_${opt}`]}</span>
                                                                {soal.kunci_jawaban === opt.toUpperCase() && (
                                                                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                                                                )}
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-sm border border-orange-100 dark:border-orange-800">
                                                    <span className="font-bold text-orange-700 dark:text-orange-400 block mb-1">Kunci Jawaban:</span>
                                                    <p className="text-gray-700 dark:text-gray-300">{soal.kunci_jawaban}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
