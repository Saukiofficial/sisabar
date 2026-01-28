import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, UserPlus, X, Printer, QrCode } from 'lucide-react'; // Tambah Icon QrCode
import QrCodeModal from '@/Components/QrCodeModal'; // Import Modal QR

export default function GuruIndex({ auth, gurus, mapels, kelas }) {
    // Setup Form dengan field lengkap
    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        id: '',
        name: '',
        username: '',
        password: '',
        mapel_id: '',
        kelas_id: '',
        status_aktif: '1'
    });

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // --- STATE UNTUK QR CODE ---
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedGuru, setSelectedGuru] = useState(null);

    // --- LOGIC BUKA MODAL (ADD / EDIT) ---
    const openModal = (guru = null) => {
        setIsEdit(!!guru); // Jika ada data guru, berarti mode EDIT

        if (guru) {
            // Mode Edit: Isi form dengan data guru yang dipilih
            setData({
                id: guru.id,
                name: guru.user.name,       // Ambil dari relasi user
                username: guru.user.username, // Ambil dari relasi user
                password: '',               // Password kosongkan saja
                mapel_id: guru.mapel_id || '',
                kelas_id: guru.kelas_id || '',
                status_aktif: guru.status_aktif ? '1' : '0'
            });
        } else {
            // Mode Add: Reset form jadi kosong
            setData({
                id: '', name: '', username: '', password: '', mapel_id: '', kelas_id: '', status_aktif: '1'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset(); // Bersihkan form saat tutup
    };

    // --- LOGIC BUKA QR CODE ---
    const handleOpenQr = (guru) => {
        setSelectedGuru(guru);
        setShowQrModal(true);
    };

    // --- LOGIC SUBMIT ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('gurus.update', data.id), { onSuccess: () => closeModal() });
        } else {
            post(route('gurus.store'), { onSuccess: () => closeModal() });
        }
    };

    // --- LOGIC DELETE ---
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data guru ini? Akun login juga akan terhapus.')) {
            destroy(route('gurus.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Manajemen Guru</h2>}>
            <Head title="Data Guru" />
            <div className="py-4 md:py-8 px-3 md:px-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-bold text-gray-700 dark:text-gray-200">Daftar Guru Pengajar</h3>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm text-sm md:text-base w-full sm:w-auto justify-center"
                    >
                        <UserPlus className="w-4 h-4" /> Tambah Guru
                    </button>
                </div>

                {/* Tabel Data - Desktop View */}
                <div className="hidden md:block bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Guru</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mapel Ajar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wali Kelas</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {gurus.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">Belum ada data guru.</td>
                                    </tr>
                                ) : (
                                    gurus.map((guru) => (
                                        <tr key={guru.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{guru.user.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{guru.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 px-2 rounded w-fit">
                                                {guru.user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                {guru.mapel ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        {guru.mapel.nama_mapel}
                                                    </span>
                                                ) : <span className="text-gray-400 dark:text-gray-500">-</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                {guru.kelas ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        {guru.kelas.nama_kelas}
                                                    </span>
                                                ) : <span className="text-gray-400 dark:text-gray-500">-</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {guru.status_aktif ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Non-Aktif</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center gap-2">

                                                    {/* TOMBOL QR CODE (BARU) */}
                                                    <button
                                                        onClick={() => handleOpenQr(guru)}
                                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                        title="Lihat QR Code"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                    </button>

                                                    {/* TOMBOL CETAK BIODATA (TETAP ADA) */}
                                                    <a
                                                        href={route('gurus.cetak', guru.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition"
                                                        title="Cetak Biodata"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </a>

                                                    <button
                                                        onClick={() => openModal(guru)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(guru.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Card View - Mobile Only */}
                <div className="md:hidden space-y-3">
                    {gurus.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                            Belum ada data guru.
                        </div>
                    ) : (
                        gurus.map((guru) => (
                            <div key={guru.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{guru.user.name}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{guru.user.email}</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleOpenQr(guru)}
                                            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
                                        >
                                            <QrCode size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Body Card */}
                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">Username:</span>
                                        <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                                            {guru.user.username}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">Mapel:</span>
                                        {guru.mapel ? (
                                            <span className="text-purple-700 dark:text-purple-300 font-medium">{guru.mapel.nama_mapel}</span>
                                        ) : '-'}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">Status:</span>
                                        {guru.status_aktif ? (
                                            <span className="text-green-600 font-bold">Aktif</span>
                                        ) : (
                                            <span className="text-red-600 font-bold">Non-Aktif</span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons Mobile */}
                                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    {/* Tombol Cetak Biodata */}
                                    <a
                                        href={route('gurus.cetak', guru.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium"
                                    >
                                        <Printer className="w-3.5 h-3.5" /> PDF
                                    </a>

                                    <button
                                        onClick={() => openModal(guru)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium"
                                    >
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(guru.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* MODAL FORM (ADD / EDIT) */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-3 md:p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg relative animate-fade-in-up">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
                                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {isEdit ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <X className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-3 md:space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                                    <input type="text" className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm"
                                        value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                        <input type="text" className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm"
                                            value={data.username} onChange={e => setData('username', e.target.value)} required />
                                        {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Password {isEdit && <span className="text-xs font-normal text-gray-500">(Opsional)</span>}
                                        </label>
                                        <input type="password" className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm"
                                            value={data.password} onChange={e => setData('password', e.target.value)}
                                            placeholder={isEdit ? "Kosongkan jika tetap" : ""}
                                            required={!isEdit} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mata Pelajaran</label>
                                        <select className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm"
                                            value={data.mapel_id} onChange={e => setData('mapel_id', e.target.value)}>
                                            <option value="">- Pilih Mapel -</option>
                                            {mapels.map(m => <option key={m.id} value={m.id}>{m.nama_mapel}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wali Kelas</label>
                                        <select className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm"
                                            value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)}>
                                            <option value="">- Bukan Wali Kelas -</option>
                                            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Akun</label>
                                    <select className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm"
                                        value={data.status_aktif} onChange={e => setData('status_aktif', e.target.value)}>
                                        <option value="1">Aktif</option>
                                        <option value="0">Non-Aktif</option>
                                    </select>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button type="button" onClick={closeModal} className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm">Batal</button>
                                    <button type="submit" disabled={processing} className="w-full sm:w-auto px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg text-sm disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan' : 'Tambah')}
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
                    user={selectedGuru}
                    type="Guru"
                />

            </div>
        </AuthenticatedLayout>
    );
}
