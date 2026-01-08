import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Book, Plus, Search, Trash2, Printer,
    Clock, CheckCircle, X, FileText, ArrowLeft
} from 'lucide-react';

export default function JurnalIndex({ auth, jurnals, kelas, mapels }) {
    const [activeTab, setActiveTab] = useState('beranda');
    const [showModal, setShowModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false); // Modal Cetak
    const [selectedJurnal, setSelectedJurnal] = useState(null); // Data untuk dicetak
    const [searchTerm, setSearchTerm] = useState('');

    // --- FORM SETUP ---
    const { data, setData, post, reset, processing, errors } = useForm({
        kelas_id: '', mapel_id: '', tanggal: new Date().toISOString().split('T')[0],
        materi: '', sub_materi: '', semester: 'Ganjil', pertemuan_ke: 1,
        jam_pelajaran: '', ki_kd: '',
        tujuan_pembelajaran: '', penjelasan_materi: '', kegiatan_pembelajaran: '',
        media_belajar: '', respon_siswa: '', jenis_penilaian: '',
        jml_hadir: 0, jml_izin: 0, jml_sakit: 0, jml_alpa: 0,
        tugas_pr: '', evaluasi_hasil: '', permasalahan_kbm: '', catatan: '',
        dokumentasi: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('guru.jurnal.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
                setActiveTab('data');
            }
        });
    };

    // --- LOGIC CETAK ---
    const handlePrintPreview = (jurnal) => {
        setSelectedJurnal(jurnal);
        setShowPrintModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const closePrintPreview = () => {
        setShowPrintModal(false);
        // Delay sedikit agar animasi smooth
        setTimeout(() => setSelectedJurnal(null), 300);
    }

    // Filter Data
    const filteredJurnals = jurnals.data.filter(j =>
        j.materi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.mapel.nama_mapel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white">Jurnal Mengajar Digital</h2>}>
            <Head title="Jurnal Mengajar" />

            {/* --- CSS KHUSUS CETAK --- */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-content, #printable-content * { visibility: visible; }
                    #printable-content { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; overflow: visible !important; height: auto !important; }
                    .no-print { display: none !important; }
                    /* Paksa background color tercetak (untuk header tabel dll) */
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            `}</style>

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* --- NAVIGATION TABS --- */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto no-print">
                    <button
                        onClick={() => setActiveTab('beranda')}
                        className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition ${activeTab === 'beranda' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                    >
                        <Book className="w-4 h-4" /> Beranda
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition ${activeTab === 'data' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                    >
                        <FileText className="w-4 h-4" /> Daftar Jurnal
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Tambah Entri
                    </button>
                </div>

                {/* --- PAGE: BERANDA --- */}
                {activeTab === 'beranda' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center no-print animate-in fade-in zoom-in duration-300">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Selamat Datang, {auth.user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Catat kegiatan mengajar Anda secara digital. Data tersimpan aman dan siap dicetak kapan saja untuk laporan administrasi.
                        </p>
                        <button onClick={() => setShowModal(true)} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg transition transform hover:scale-105">
                            Buat Jurnal Baru
                        </button>
                    </div>
                )}

                {/* --- PAGE: DAFTAR JURNAL --- */}
                {activeTab === 'data' && (
                    <div className="space-y-6 no-print animate-in slide-in-from-right duration-300">

                        {/* Filter Bar */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari materi atau mapel..."
                                    className="pl-10 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Table List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Tanggal</th>
                                            <th className="px-6 py-4">Mapel / Kelas</th>
                                            <th className="px-6 py-4">Materi</th>
                                            <th className="px-6 py-4 text-center">Kehadiran</th>
                                            <th className="px-6 py-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredJurnals.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada data jurnal.</td></tr>
                                        ) : (
                                            filteredJurnals.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                                    <td className="px-6 py-4 font-medium">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold">{item.mapel.nama_mapel}</div>
                                                        <div className="text-xs text-gray-500">{item.kelas.nama_kelas}</div>
                                                    </td>
                                                    <td className="px-6 py-4 truncate max-w-xs">{item.materi}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">H: {item.jml_hadir}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handlePrintPreview(item)}
                                                            className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition"
                                                            title="Lihat & Cetak"
                                                        >
                                                            <Printer className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => { if(confirm('Hapus jurnal ini?')) router.delete(route('guru.jurnal.destroy', item.id)) }}
                                                            className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL FORM (INPUT JURNAL) --- */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
                        {/* PERBAIKAN: Gunakan flex-col dan max-h untuk scroll internal */}
                        <div className="bg-white dark:bg-gray-800 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
                            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl flex-shrink-0">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Form Jurnal Mengajar</h3>
                                <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-gray-400 hover:text-red-500" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* FIELDSET 1: INFORMASI UMUM */}
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative">
                                        <div className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-sm font-bold text-blue-600">
                                            Informasi Umum
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mata Pelajaran</label>
                                                <select className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.mapel_id} onChange={e => setData('mapel_id', e.target.value)} required>
                                                    <option value="">Pilih Mapel...</option>
                                                    {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                                </select>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kelas</label>
                                                <select className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)} required>
                                                    <option value="">Pilih Kelas...</option>
                                                    {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                                </select>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                                                <select className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.semester} onChange={e => setData('semester', e.target.value)}>
                                                    <option value="Ganjil">Ganjil</option>
                                                    <option value="Genap">Genap</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal</label>
                                                <input type="date" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} required />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pertemuan Ke-</label>
                                                <input type="number" min="1" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.pertemuan_ke} onChange={e => setData('pertemuan_ke', e.target.value)} />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jam Pelajaran</label>
                                                <input type="text" placeholder="Cth: 1-3" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.jam_pelajaran} onChange={e => setData('jam_pelajaran', e.target.value)} />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nomor KI/KD</label>
                                                <input type="text" placeholder="Cth: 3.1, 4.1" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.ki_kd} onChange={e => setData('ki_kd', e.target.value)} />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Materi Pokok</label>
                                                <input type="text" className="w-full rounded-lg border-gray-300 dark:bg-gray-700 font-bold" value={data.materi} onChange={e => setData('materi', e.target.value)} required />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Materi</label>
                                                <input type="text" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.sub_materi} onChange={e => setData('sub_materi', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* FIELDSET 2: ISI JURNAL */}
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative">
                                        <div className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-sm font-bold text-blue-600">
                                            Detail Pembelajaran
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tujuan Pembelajaran</label>
                                                <textarea rows="3" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.tujuan_pembelajaran} onChange={e => setData('tujuan_pembelajaran', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kegiatan Pembelajaran</label>
                                                <textarea rows="3" placeholder="Pendahuluan, Inti, Penutup..." className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.kegiatan_pembelajaran} onChange={e => setData('kegiatan_pembelajaran', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Penjelasan Materi</label>
                                                <textarea rows="3" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.penjelasan_materi} onChange={e => setData('penjelasan_materi', e.target.value)}></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Media Belajar</label>
                                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.media_belajar} onChange={e => setData('media_belajar', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Respon Siswa</label>
                                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.respon_siswa} onChange={e => setData('respon_siswa', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Penilaian</label>
                                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:bg-gray-700" value={data.jenis_penilaian} onChange={e => setData('jenis_penilaian', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FIELDSET 3: KEHADIRAN & EVALUASI */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative">
                                            <div className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-sm font-bold text-blue-600">
                                                Kehadiran Siswa (Jumlah)
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 mt-2">
                                                <div className="text-center">
                                                    <label className="block text-xs font-bold text-green-600 mb-1">HADIR</label>
                                                    <input type="number" min="0" className="w-full text-center rounded-lg border-green-200 focus:ring-green-500" value={data.jml_hadir} onChange={e => setData('jml_hadir', e.target.value)} />
                                                </div>
                                                <div className="text-center">
                                                    <label className="block text-xs font-bold text-blue-600 mb-1">IZIN</label>
                                                    <input type="number" min="0" className="w-full text-center rounded-lg border-blue-200 focus:ring-blue-500" value={data.jml_izin} onChange={e => setData('jml_izin', e.target.value)} />
                                                </div>
                                                <div className="text-center">
                                                    <label className="block text-xs font-bold text-yellow-600 mb-1">SAKIT</label>
                                                    <input type="number" min="0" className="w-full text-center rounded-lg border-yellow-200 focus:ring-yellow-500" value={data.jml_sakit} onChange={e => setData('jml_sakit', e.target.value)} />
                                                </div>
                                                <div className="text-center">
                                                    <label className="block text-xs font-bold text-red-600 mb-1">ALPA</label>
                                                    <input type="number" min="0" className="w-full text-center rounded-lg border-red-200 focus:ring-red-500" value={data.jml_alpa} onChange={e => setData('jml_alpa', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative">
                                            <div className="absolute -top-3 left-4 bg-white dark:bg-gray-800 px-2 text-sm font-bold text-blue-600">
                                                Evaluasi & Catatan
                                            </div>
                                            <div className="space-y-3 mt-2">
                                                <div>
                                                    <input type="text" placeholder="Tugas / PR..." className="w-full rounded-lg border-gray-300 text-sm" value={data.tugas_pr} onChange={e => setData('tugas_pr', e.target.value)} />
                                                </div>
                                                <div>
                                                    <input type="text" placeholder="Evaluasi Hasil..." className="w-full rounded-lg border-gray-300 text-sm" value={data.evaluasi_hasil} onChange={e => setData('evaluasi_hasil', e.target.value)} />
                                                </div>
                                                <div>
                                                    <input type="text" placeholder="Permasalahan KBM..." className="w-full rounded-lg border-gray-300 text-sm" value={data.permasalahan_kbm} onChange={e => setData('permasalahan_kbm', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* UPLOAD & SUBMIT */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dokumentasi (Foto)</label>
                                            <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setData('dokumentasi', e.target.files[0])} />
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                                                Batal
                                            </button>
                                            <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg transition">
                                                {processing ? 'Menyimpan...' : 'Simpan Jurnal'}
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL PREVIEW CETAK (DETAIL) --- */}
                {showPrintModal && selectedJurnal && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
                        {/* PERBAIKAN: Tinggi modal tetap (tidak min-h-screen) untuk scroll internal */}
                        <div className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[95vh] md:rounded-lg shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-300">

                            {/* Tombol Aksi (Tidak Tercetak) - Flex-shrink-0 agar tidak mengecil */}
                            <div className="p-4 border-b flex justify-between items-center bg-gray-100 no-print rounded-t-lg flex-shrink-0 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={closePrintPreview}
                                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
                                        title="Kembali"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <h3 className="font-bold text-gray-700">Preview Cetak</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md">
                                        <Printer className="w-4 h-4" /> Cetak / PDF
                                    </button>
                                    <button onClick={closePrintPreview} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300">
                                        Tutup
                                    </button>
                                </div>
                            </div>

                            {/* AREA KERTAS (YANG AKAN DICETAK) - Scroll di sini */}
                            <div id="printable-content" className="p-10 font-serif text-black leading-relaxed flex-1 overflow-y-auto">
                                {/* Header Surat */}
                                <div className="text-center border-b-2 border-black pb-4 mb-6">
                                    <h2 className="text-xl font-bold uppercase tracking-wider mb-1">JURNAL MENGAJAR HARIAN</h2>
                                    <h3 className="text-lg font-bold uppercase">MA SYEKH ABDURRAHMAN</h3>
                                    <p className="text-sm mt-2">Semester {selectedJurnal.semester || 'Ganjil'} | Tahun Ajaran {new Date().getFullYear()}/{new Date().getFullYear()+1}</p>
                                </div>

                                {/* Tabel Info */}
                                <table className="w-full mb-6 text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="font-bold w-40 py-1">Nama Guru</td>
                                            <td>: {auth.user.name}</td>
                                            <td className="font-bold w-40">Mata Pelajaran</td>
                                            <td>: {selectedJurnal.mapel.nama_mapel}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold py-1">Hari/Tanggal</td>
                                            <td>: {new Date(selectedJurnal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="font-bold">Kelas</td>
                                            <td>: {selectedJurnal.kelas.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold py-1">Pertemuan Ke-</td>
                                            <td>: {selectedJurnal.pertemuan_ke}</td>
                                            <td className="font-bold">Jam Pelajaran</td>
                                            <td>: {selectedJurnal.jam_pelajaran || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Isi Jurnal */}
                                <div className="mb-6">
                                    <h4 className="font-bold border-b border-black mb-2 pb-1">A. MATERI PEMBELAJARAN</h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm pl-2">
                                        <p><span className="font-bold mr-2">Materi Pokok:</span> {selectedJurnal.materi}</p>
                                        <p><span className="font-bold mr-2">Sub Materi:</span> {selectedJurnal.sub_materi || '-'}</p>
                                        <p><span className="font-bold mr-2">KI / KD:</span> {selectedJurnal.ki_kd || '-'}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold border-b border-black mb-2 pb-1">B. KEGIATAN PEMBELAJARAN</h4>
                                    <div className="text-sm pl-2 space-y-2">
                                        <div>
                                            <span className="font-bold block text-gray-700">Tujuan Pembelajaran:</span>
                                            <p>{selectedJurnal.tujuan_pembelajaran || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="font-bold block text-gray-700">Aktivitas Siswa:</span>
                                            <p>{selectedJurnal.kegiatan_pembelajaran || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="font-bold block text-gray-700">Media & Alat:</span>
                                            <p>{selectedJurnal.media_belajar || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold border-b border-black mb-2 pb-1">C. REKAPITULASI KEHADIRAN</h4>
                                    <table className="w-full border border-black text-center text-sm">
                                        <thead className="bg-gray-100 border-b border-black font-bold">
                                            <tr>
                                                <th className="py-2 border-r border-black">Hadir</th>
                                                <th className="py-2 border-r border-black">Sakit</th>
                                                <th className="py-2 border-r border-black">Izin</th>
                                                <th className="py-2">Alpa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-2 border-r border-black">{selectedJurnal.jml_hadir}</td>
                                                <td className="py-2 border-r border-black">{selectedJurnal.jml_sakit}</td>
                                                <td className="py-2 border-r border-black">{selectedJurnal.jml_izin}</td>
                                                <td className="py-2">{selectedJurnal.jml_alpa}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mb-8">
                                    <h4 className="font-bold border-b border-black mb-2 pb-1">D. CATATAN & EVALUASI</h4>
                                    <div className="text-sm pl-2 space-y-1">
                                        <p><span className="font-bold">Tugas / PR:</span> {selectedJurnal.tugas_pr || '-'}</p>
                                        <p><span className="font-bold">Catatan Guru:</span> {selectedJurnal.catatan || '-'}</p>
                                    </div>
                                </div>

                                {/* Tanda Tangan */}
                                <div className="flex justify-end mt-12 pr-10">
                                    <div className="text-center">
                                        <p className="mb-16">Guru Mata Pelajaran,</p>
                                        <p className="font-bold underline">{auth.user.name}</p>
                                        <p className="text-xs">NIP. .......................</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Modal dengan Tombol Kembali Besar */}
                            <div className="p-4 border-t bg-gray-50 no-print rounded-b-lg flex justify-center flex-shrink-0">
                                <button
                                    onClick={closePrintPreview}
                                    className="w-full md:w-auto px-8 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" /> Kembali ke Daftar
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
