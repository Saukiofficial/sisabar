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
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedJurnal, setSelectedJurnal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handlePrintPreview = (jurnal) => {
        setSelectedJurnal(jurnal);
        setShowPrintModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const closePrintPreview = () => {
        setShowPrintModal(false);
        setTimeout(() => setSelectedJurnal(null), 300);
    }

    const filteredJurnals = jurnals.data.filter(j =>
        j.materi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.mapel.nama_mapel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white">Jurnal Mengajar Digital</h2>}>
            <Head title="Jurnal Mengajar" />

            {/* CSS KHUSUS CETAK */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }

                    body * { visibility: hidden; }
                    #printable-content, #printable-content * { visibility: visible; }
                    #printable-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0 0 30mm 0 !important;
                        margin: 0 !important;
                        background: white;
                        color: black;
                        overflow: visible !important;
                        height: auto !important;
                        min-height: 100vh !important;
                    }
                    .no-print { display: none !important; }
                    .kop-surat {
                        overflow: hidden !important;
                        margin: 0 0 15px 0 !important;
                        border: 3px solid #000 !important;
                        border-left: 8px solid #1e4d7b !important;
                    }
                    .kop-container {
                        display: flex !important;
                        align-items: center !important;
                        width: 100% !important;
                    }
                    .kop-logo-section {
                        width: 140px !important;
                        padding: 15px !important;
                        flex-shrink: 0 !important;
                    }
                    .kop-logo {
                        width: 110px !important;
                        height: 110px !important;
                    }
                    .kop-content {
                        flex: 1 !important;
                        padding: 8px 12px !important;
                    }
                    .kop-alamat {
                        font-size: 7.5px !important;
                        width: 120px !important;
                        padding: 6px !important;
                        flex-shrink: 0 !important;
                        line-height: 1.4 !important;
                    }
                    .kop-nama-yayasan {
                        font-size: 9px !important;
                        margin: 0 0 2px 0 !important;
                    }
                    .kop-nama-sekolah {
                        font-size: 22px !important;
                        letter-spacing: 1.5px !important;
                        margin: 3px 0 !important;
                    }
                    .kop-nsm-npsn {
                        font-size: 9px !important;
                        margin: 3px 0 !important;
                    }
                    .kop-status {
                        font-size: 11px !important;
                        padding: 3px 18px !important;
                        margin: 4px 0 !important;
                    }
                    .kop-contact {
                        font-size: 8.5px !important;
                        gap: 15px !important;
                        margin-top: 6px !important;
                    }
                    .kop-contact-item {
                        gap: 5px !important;
                    }
                    .kop-icon {
                        width: 13px !important;
                        height: 13px !important;
                        font-size: 8px !important;
                    }

                    /* Styling untuk konten lainnya */
                    .text-center { text-align: center !important; }
                    .font-bold { font-weight: bold !important; }
                    table {
                        width: 100% !important;
                        page-break-inside: avoid !important;
                    }

                    /* Tanda tangan kompak agar NIP terlihat penuh */
                    .flex.justify-end {
                        margin-top: 12px !important;
                        margin-bottom: 10px !important;
                        page-break-inside: avoid !important;
                    }

                    /* Mengurangi jarak untuk tanda tangan */
                    .mb-10 {
                        margin-bottom: 2rem !important;
                    }

                    page-break-inside: avoid;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                    print-color-adjust: exact;
                }

                /* Style untuk kop surat */
                .kop-surat {
                    margin-bottom: 20px;
                    border: 3px solid #000;
                    border-left: 8px solid #1e4d7b;
                    overflow: hidden;
                }

                .kop-container {
                    display: flex;
                    align-items: center;
                }

                .kop-logo-section {
                    width: 180px;
                    background: linear-gradient(135deg, #1e4d7b 0%, #2d6a9f 100%);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .kop-logo {
                    width: 140px;
                    height: 140px;
                }

                .kop-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .kop-content {
                    flex: 1;
                    padding: 12px 20px;
                    background: white;
                }

                .kop-nama-yayasan {
                    font-size: 11px;
                    font-weight: 700;
                    color: #000;
                    margin: 0 0 3px 0;
                    line-height: 1.3;
                    font-family: Arial, sans-serif;
                }

                .kop-nama-sekolah {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1e5a96;
                    margin: 5px 0;
                    letter-spacing: 3px;
                    font-family: Arial, sans-serif;
                    line-height: 1.2;
                }

                .kop-nsm-npsn {
                    font-size: 11px;
                    font-weight: 600;
                    color: #000;
                    margin: 5px 0;
                    font-family: Arial, sans-serif;
                }

                .kop-status {
                    background-color: #1e5a96;
                    color: white;
                    font-size: 13px;
                    font-weight: 700;
                    padding: 5px 25px;
                    display: inline-block;
                    margin: 6px 0;
                    font-family: Arial, sans-serif;
                }

                .kop-contact {
                    font-size: 10px;
                    color: #000;
                    margin-top: 8px;
                    display: flex;
                    gap: 25px;
                    font-family: Arial, sans-serif;
                }

                .kop-contact-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .kop-icon {
                    width: 16px;
                    height: 16px;
                    background-color: #ff6600;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    flex-shrink: 0;
                    color: white;
                }

                .kop-alamat {
                    font-size: 9px;
                    color: #000;
                    font-style: italic;
                    text-align: right;
                    line-height: 1.6;
                    padding: 10px 10px;
                    width: 140px;
                    flex-shrink: 0;
                    font-family: Arial, sans-serif;
                    align-self: center;
                    word-wrap: break-word;
                    white-space: normal;
                }
            `}</style>

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* NAVIGATION TABS */}
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

                {/* PAGE: BERANDA */}
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

                {/* PAGE: DAFTAR JURNAL */}
                {activeTab === 'data' && (
                    <div className="space-y-6 no-print animate-in slide-in-from-right duration-300">

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Cari materi atau mapel..."
                                    className="pl-10 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-400"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

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
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Belum ada data jurnal.</td></tr>
                                        ) : (
                                            filteredJurnals.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-200">
                                                    <td className="px-6 py-4 font-medium">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900 dark:text-gray-100">{item.mapel.nama_mapel}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.kelas.nama_kelas}</div>
                                                    </td>
                                                    <td className="px-6 py-4 truncate max-w-xs">{item.materi}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full font-bold">H: {item.jml_hadir}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handlePrintPreview(item)}
                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg transition"
                                                            title="Lihat & Cetak"
                                                        >
                                                            <Printer className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => { if(confirm('Hapus jurnal ini?')) router.delete(route('guru.jurnal.destroy', item.id)) }}
                                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg transition"
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

                {/* MODAL FORM */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
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
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Mata Pelajaran</label>
                                                <select className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.mapel_id} onChange={e => setData('mapel_id', e.target.value)} required>
                                                    <option value="">Pilih Mapel...</option>
                                                    {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                                </select>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Kelas</label>
                                                <select className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)} required>
                                                    <option value="">Pilih Kelas...</option>
                                                    {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                                </select>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Semester</label>
                                                <select className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.semester} onChange={e => setData('semester', e.target.value)}>
                                                    <option value="Ganjil">Ganjil</option>
                                                    <option value="Genap">Genap</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Tanggal</label>
                                                <input type="date" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} required />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Pertemuan Ke-</label>
                                                <input type="number" min="1" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.pertemuan_ke} onChange={e => setData('pertemuan_ke', e.target.value)} />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Jam Pelajaran</label>
                                                <input type="text" placeholder="Cth: 1-3" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500" value={data.jam_pelajaran} onChange={e => setData('jam_pelajaran', e.target.value)} />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Nomor KI/KD</label>
                                                <input type="text" placeholder="Cth: 3.1, 4.1" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500" value={data.ki_kd} onChange={e => setData('ki_kd', e.target.value)} />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Materi Pokok</label>
                                                <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 font-bold" value={data.materi} onChange={e => setData('materi', e.target.value)} required />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Sub Materi</label>
                                                <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.sub_materi} onChange={e => setData('sub_materi', e.target.value)} />
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
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Tujuan Pembelajaran</label>
                                                <textarea rows="3" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.tujuan_pembelajaran} onChange={e => setData('tujuan_pembelajaran', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Kegiatan Pembelajaran</label>
                                                <textarea rows="3" placeholder="Pendahuluan, Inti, Penutup..." className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500" value={data.kegiatan_pembelajaran} onChange={e => setData('kegiatan_pembelajaran', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Penjelasan Materi</label>
                                                <textarea rows="3" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.penjelasan_materi} onChange={e => setData('penjelasan_materi', e.target.value)}></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Media Belajar</label>
                                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.media_belajar} onChange={e => setData('media_belajar', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Respon Siswa</label>
                                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.respon_siswa} onChange={e => setData('respon_siswa', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Penilaian</label>
                                                    <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" value={data.jenis_penilaian} onChange={e => setData('jenis_penilaian', e.target.value)} />
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
                                                    <input type="text" placeholder="Tugas / PR..." className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 text-sm" value={data.tugas_pr} onChange={e => setData('tugas_pr', e.target.value)} />
                                                </div>
                                                <div>
                                                    <input type="text" placeholder="Evaluasi Hasil..." className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 text-sm" value={data.evaluasi_hasil} onChange={e => setData('evaluasi_hasil', e.target.value)} />
                                                </div>
                                                <div>
                                                    <input type="text" placeholder="Permasalahan KBM..." className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 text-sm" value={data.permasalahan_kbm} onChange={e => setData('permasalahan_kbm', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* UPLOAD & SUBMIT */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Dokumentasi (Foto)</label>
                                            <input type="file" className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800" onChange={e => setData('dokumentasi', e.target.files[0])} />
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                Batal
                                            </button>
                                            <button type="submit" disabled={processing} className="px-6 py-2.5 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                                                {processing ? 'Menyimpan...' : 'Simpan Jurnal'}
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL PREVIEW CETAK */}
                {showPrintModal && selectedJurnal && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
                        <div className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[95vh] md:rounded-lg shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-300">

                            {/* Tombol Aksi */}
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

                            {/* AREA KERTAS DENGAN KOP SURAT */}
                            <div id="printable-content" className="p-10 font-serif text-black leading-relaxed flex-1 overflow-y-auto" style={{maxWidth: '100%'}}>

                                {/* KOP SURAT */}
                                <div className="kop-surat">
                                    <div className="kop-container">
                                        {/* Background Biru Penuh dengan Logo */}
                                        <div className="kop-logo-section">
                                            <div className="kop-logo">
                                                <img src="/images/logosekolah.png" alt="Logo Sekolah" />
                                            </div>
                                        </div>

                                        {/* Konten Utama */}
                                        <div className="kop-content">
                                            <p className="kop-nama-yayasan">YAYASAN SYEKH ABDURRAHMAN BUJU' AGUNG RABAH (YASYRAH)</p>
                                            <h1 className="kop-nama-sekolah">MA. SYEKH ABDURRAHMAN</h1>
                                            <p className="kop-nsm-npsn">NSM: 131235280108&nbsp;&nbsp;&nbsp;&nbsp;NPSN: 69994782</p>
                                            <div className="kop-status">TERAKREDITASI</div>
                                            <div className="kop-contact">
                                                <div className="kop-contact-item">
                                                    <div className="kop-icon">🌐</div>
                                                    <span>www.sabar.or.id</span>
                                                </div>
                                                <div className="kop-contact-item">
                                                    <div className="kop-icon">✉</div>
                                                    <span>ma.syekhabdurrahman@gmail.com</span>
                                                </div>
                                                <div className="kop-contact-item">
                                                    <div className="kop-icon">📞</div>
                                                    <span>+6282334240445</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Alamat Kanan */}
                                        <div className="kop-alamat">
                                            <i>Jl. Asta Rabah,<br />
                                            Kompleks PP<br />
                                            Syekh Abdurrahman<br />
                                            Rabah Sumedangan,<br />
                                            Pademawu,<br />
                                            Pamekasan<br />
                                            69321</i>
                                        </div>
                                    </div>
                                </div>

                                {/* Header Jurnal */}
                                <div className="text-center mb-6 mt-4">
                                    <h2 className="text-xl font-bold uppercase tracking-wider mb-1">JURNAL MENGAJAR HARIAN</h2>
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

                                <div className="mb-4">
                                    <h4 className="font-bold border-b border-black mb-2 pb-1">D. CATATAN & EVALUASI</h4>
                                    <div className="text-sm pl-2 space-y-1">
                                        <p><span className="font-bold">Tugas / PR:</span> {selectedJurnal.tugas_pr || '-'}</p>
                                        <p><span className="font-bold">Catatan Guru:</span> {selectedJurnal.catatan || '-'}</p>
                                    </div>
                                </div>

                                {/* Tanda Tangan */}
                                <div className="flex justify-end mt-6 pr-10 mb-6" style={{pageBreakInside: 'avoid'}}>
                                    <div className="text-center">
                                        <p className="mb-10">Guru Mata Pelajaran,</p>
                                        <p className="font-bold underline">{auth.user.name}</p>
                                        <p className="text-xs mt-1">NIP. .......................</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Modal */}
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
