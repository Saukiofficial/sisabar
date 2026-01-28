import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Pencil, Trash2, Plus, Search, X, CheckCircle,
    Lock, QrCode, Printer, FileBarChart, Upload
} from 'lucide-react';
import QrCodeModal from '@/Components/QrCodeModal';
import RekapSidePanel from '@/Components/RekapSidePanel';
import axios from 'axios';

export default function SiswaIndex({ auth, siswas, kelas_list, filters }) {
    // --- FORM STATE (Untuk CRUD) ---
    const { data, setData, post, put, delete: destroy, reset, processing, errors, clearErrors } = useForm({
        id: '',
        nama: '',
        nis: '',
        kelas_id: '',
        jenis_kelamin: 'L',
        email: '',
        password: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [filterKelas, setFilterKelas] = useState(filters.kelas_id || '');

    // --- STATE MODAL QR CODE ---
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState(null);

    // --- STATE SIDE PANEL REKAP ABSENSI ---
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [rekapData, setRekapData] = useState(null);
    const [isLoadingRekap, setIsLoadingRekap] = useState(false);

    // --- STATE MODAL IMPORT ---
    const [showImportModal, setShowImportModal] = useState(false);
    const { data: importData, setData: setImportData, post: postImport, processing: processingImport, errors: errorsImport, reset: resetImport } = useForm({
        file: null
    });

    // --- FILTER & SEARCH ---
    const handleFilter = () => {
        router.get(route('siswas.index'), { kelas_id: filterKelas, search: searchQuery }, { preserveState: true });
    };

    // --- MODAL CRUD LOGIC ---
    const openModal = (siswa = null) => {
        clearErrors();
        setIsEdit(!!siswa);
        if (siswa) {
            setData({
                id: siswa.id,
                nama: siswa.nama,
                nis: siswa.nis,
                kelas_id: siswa.kelas_id,
                jenis_kelamin: siswa.jenis_kelamin || 'L',
                email: siswa.user?.email || '',
                password: ''
            });
        } else {
            setData({
                id: '', nama: '', nis: '', kelas_id: '', jenis_kelamin: 'L',
                email: '', password: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('siswas.update', data.id), { onSuccess: () => closeModal() });
        } else {
            post(route('siswas.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus data siswa ini? Akun login siswa juga akan dihapus.')) {
            destroy(route('siswas.destroy', id));
        }
    };

    // --- QR CODE LOGIC ---
    const handleOpenQr = (siswa) => {
        setSelectedSiswa(siswa);
        setShowQrModal(true);
    };

    // --- REKAP ABSENSI LOGIC (KLIK NAMA) ---
    const handleNameClick = async (siswaId) => {
        setIsSidePanelOpen(true);
        setIsLoadingRekap(true);
        setRekapData(null);

        try {
            const response = await axios.get(route('admin.siswas.rekap', siswaId));
            setRekapData(response.data);
        } catch (error) {
            console.error("Gagal memuat rekap absensi", error);
            setIsSidePanelOpen(false);
        } finally {
            setIsLoadingRekap(false);
        }
    };

    // --- IMPORT LOGIC ---
    const handleImportSubmit = (e) => {
        e.preventDefault();
        postImport(route('admin.siswas.import'), {
            onSuccess: () => {
                setShowImportModal(false);
                resetImport();
            }
        });
    };

    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 uppercase tracking-tight">Manajemen Siswa</h2>}
        >
            <Head title="Data Siswa" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Status Message */}
                {flash.message && (
                    <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl flex items-center shadow-sm">
                        <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{flash.message}</span>
                    </div>
                )}

                {/* TOOLBAR */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 transition-all">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            <select
                                className="border-gray-300 dark:border-gray-600 rounded-xl text-sm dark:bg-gray-700 dark:text-white focus:ring-blue-500"
                                value={filterKelas}
                                onChange={(e) => setFilterKelas(e.target.value)}
                            >
                                <option value="">Semua Kelas</option>
                                {kelas_list.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                            </select>
                            <div className="relative flex-1 sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Cari Nama / NIS..."
                                    className="w-full border-gray-300 dark:border-gray-600 rounded-xl text-sm pl-10 dark:bg-gray-700 dark:text-white focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                />
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <button onClick={handleFilter} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                                Filter
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 w-full lg:w-auto">
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 text-sm font-bold"
                            >
                                <Upload size={18} /> Import
                            </button>
                            <Link
                                href={route('admin.qr.generate')}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 text-sm font-bold"
                            >
                                <Printer size={18} /> Cetak QR
                            </Link>
                            <button
                                onClick={() => openModal()}
                                className="flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg text-sm font-bold"
                            >
                                <Plus size={18} /> Tambah Siswa
                            </button>
                        </div>
                    </div>
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">NIS</th>
                                <th className="px-6 py-4">Nama Siswa</th>
                                <th className="px-6 py-4">Kelas</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {siswas.data.length > 0 ? siswas.data.map((siswa) => (
                                <tr key={siswa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                    <td className="px-6 py-4 font-mono text-gray-500">{siswa.nis}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                        <button
                                            onClick={() => handleNameClick(siswa.id)}
                                            className="group flex items-center gap-2 hover:text-blue-600 transition"
                                        >
                                            {siswa.nama}
                                            <FileBarChart size={14} className="opacity-0 group-hover:opacity-100 transition text-blue-500" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold uppercase">
                                            {siswa.kelas?.nama_kelas || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-[150px]">{siswa.user?.email || '-'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleOpenQr(siswa)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Lihat QR">
                                                <QrCode size={18} />
                                            </button>
                                            <button onClick={() => openModal(siswa)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(siswa.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Tidak ada data siswa ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE LIST */}
                <div className="lg:hidden space-y-4">
                    {siswas.data.map((siswa) => (
                        <div key={siswa.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-3">
                                <button
                                    onClick={() => handleNameClick(siswa.id)}
                                    className="text-left group"
                                >
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {siswa.nama}
                                        <FileBarChart size={14} className="text-blue-500" />
                                    </h4>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">{siswa.nis} • {siswa.kelas?.nama_kelas}</p>
                                </button>
                                <button onClick={() => handleOpenQr(siswa)} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                                    <QrCode size={20} />
                                </button>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => openModal(siswa)} className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                                    <Pencil size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(siswa.id)} className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                                    <Trash2 size={14} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Desktop & Mobile */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {siswas.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.get(link.url, { kelas_id: filterKelas, search: searchQuery })}
                            disabled={!link.url || link.active}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${link.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

            </div>

            {/* MODAL IMPORT */}
            {showImportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Import Data Siswa</h3>
                            <button onClick={() => setShowImportModal(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleImportSubmit} className="p-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-6 text-sm">
                                <p className="font-bold text-blue-700 dark:text-blue-300 mb-2 underline">Petunjuk:</p>
                                <ul className="list-disc list-inside text-blue-600 dark:text-blue-400 space-y-1 text-xs">
                                    <li>Format file: .xlsx, .xls, atau .csv</li>
                                    <li>Kolom wajib: <b>nis, nama_lengkap, kelas, jenis_kelamin</b></li>
                                    <li>Kelas harus sesuai dengan nama kelas di sistem.</li>
                                </ul>
                                {/* --- FIX: Menggunakan Route Laravel, Bukan File Statis --- */}
                                <a
                                    href={route('admin.siswas.template')}
                                    className="mt-4 inline-block text-blue-700 font-bold hover:underline"
                                >
                                    Download Template →
                                </a>
                            </div>
                            <input
                                type="file"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={e => setImportData('file', e.target.files[0])}
                            />
                            {errorsImport.file && <p className="text-red-500 text-xs mt-2 font-medium">{errorsImport.file}</p>}
                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setShowImportModal(false)} className="flex-1 py-3 bg-gray-100 rounded-2xl font-bold">Batal</button>
                                <button disabled={processingImport} className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20">
                                    {processingImport ? 'Proses...' : 'Upload Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL CRUD */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-lg">{isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
                            <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Nama Lengkap</label>
                                    <input type="text" className="w-full mt-1 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 focus:ring-blue-500" value={data.nama} onChange={e => setData('nama', e.target.value)} />
                                    {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">NIS (Username)</label>
                                    <input type="text" className="w-full mt-1 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 focus:ring-blue-500 font-mono" value={data.nis} onChange={e => setData('nis', e.target.value)} />
                                    {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Kelas</label>
                                    <select className="w-full mt-1 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 focus:ring-blue-500" value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)}>
                                        <option value="">Pilih Kelas</option>
                                        {kelas_list.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                    </select>
                                    {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Gender</label>
                                    <select className="w-full mt-1 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 focus:ring-blue-500" value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)}>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div className="col-span-2 mt-4 pt-4 border-t dark:border-gray-700">
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email Akun</label>
                                    <input type="email" className="w-full mt-1 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 focus:ring-blue-500" value={data.email} onChange={e => setData('email', e.target.value)} />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Password {isEdit && '(Kosongkan jika tidak ganti)'}</label>
                                    <input type="password" placeholder="••••••••" className="w-full mt-1 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 focus:ring-blue-500" value={data.password} onChange={e => setData('password', e.target.value)} />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                            </div>
                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold transition hover:bg-gray-200">Batal</button>
                                <button disabled={processing} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL QR CODE */}
            <QrCodeModal
                show={showQrModal}
                onClose={() => setShowQrModal(false)}
                user={selectedSiswa}
                type="Siswa"
            />

            {/* SIDE PANEL REKAP */}
            <RekapSidePanel
                isOpen={isSidePanelOpen}
                onClose={() => setIsSidePanelOpen(false)}
                data={rekapData}
                isLoading={isLoadingRekap}
            />

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out;
                }
            `}</style>

        </AuthenticatedLayout>
    );
}
