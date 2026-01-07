import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search, X, CheckCircle, Mail, Lock } from 'lucide-react';

export default function SiswaIndex({ auth, siswas, kelas_list, filters }) {
    // --- FORM STATE ---
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

    // --- FILTER & SEARCH ---
    const handleFilter = () => {
        router.get(route('siswas.index'), { kelas_id: filterKelas, search: searchQuery }, { preserveState: true });
    };

    // --- MODAL LOGIC ---
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

    // --- CRUD ACTIONS ---
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

    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Data Siswa</h2>}>
            <Head title="Manajemen Siswa" />

            <div className="py-4 md:py-6 px-3 md:px-6">

                {/* Flash Message */}
                {flash.message && (
                    <div className="mb-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative flex items-center text-sm">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{flash.message}</span>
                    </div>
                )}

                {/* TOOLBAR: FILTER & ADD */}
                <div className="flex flex-col gap-3 mb-4 md:mb-6 bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <select
                            className="flex-1 sm:flex-none border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                            value={filterKelas}
                            onChange={(e) => setFilterKelas(e.target.value)}
                        >
                            <option value="">Semua Kelas</option>
                            {kelas_list.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                        </select>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Cari Nama..."
                                className="w-full border-gray-300 dark:border-gray-600 rounded-lg text-sm pl-9 dark:bg-gray-700 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button onClick={handleFilter} className="bg-gray-800 dark:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 whitespace-nowrap">
                            Cari
                        </button>
                    </div>

                    <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md text-sm">
                        <Plus className="w-4 h-4" /> Tambah Siswa
                    </button>
                </div>

                {/* TABEL SISWA - Desktop View */}
                <div className="hidden lg:block bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">NIS</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Nama Siswa</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Akun (Email)</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">L/P</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Kelas</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {siswas.data.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">Tidak ada data siswa.</td></tr>
                                ) : (
                                    siswas.data.map((siswa) => (
                                        <tr key={siswa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{siswa.nis}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{siswa.nama}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {siswa.user ? siswa.user.email : <span className="text-red-400 text-xs italic">Belum ada akun</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${siswa.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'}`}>
                                                    {siswa.jenis_kelamin}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{siswa.kelas?.nama_kelas}</td>
                                            <td className="px-6 py-4 text-center flex justify-center gap-2">
                                                <button onClick={() => openModal(siswa)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 p-2 rounded transition"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(siswa.id)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 p-2 rounded transition"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2">
                        {siswas.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => link.url && router.get(link.url, { kelas_id: filterKelas, search: searchQuery })}
                                disabled={!link.url || link.active}
                                className={`px-3 py-1 rounded border text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>

                {/* CARD VIEW - Mobile & Tablet */}
                <div className="lg:hidden space-y-3">
                    {siswas.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                            Tidak ada data siswa.
                        </div>
                    ) : (
                        siswas.data.map((siswa) => (
                            <div key={siswa.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{siswa.nama}</h4>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${siswa.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'}`}>
                                                {siswa.jenis_kelamin}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">NIS: {siswa.nis}</p>
                                    </div>
                                </div>

                                {/* Body Card */}
                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">Kelas:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                                            {siswa.kelas?.nama_kelas || '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300 text-right break-all max-w-[60%]">
                                            {siswa.user ? siswa.user.email : <span className="text-red-400 italic">Belum ada akun</span>}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => openModal(siswa)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition text-xs font-medium"
                                    >
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(siswa.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition text-xs font-medium"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* PAGINATION Mobile */}
                    <div className="flex justify-center gap-1 pt-2 flex-wrap">
                        {siswas.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => link.url && router.get(link.url, { kelas_id: filterKelas, search: searchQuery })}
                                disabled={!link.url || link.active}
                                className={`px-2.5 py-1 rounded border text-xs ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>

                {/* MODAL FORM */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-4 overflow-y-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg my-4 overflow-hidden animate-fade-in-up">
                            <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Siswa & Akun' : 'Tambah Siswa Baru'}</h3>
                                <button onClick={closeModal}><X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-3 md:space-y-4">

                                {/* Info Akademik */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">NIS (Username)</label>
                                        <input
                                            type="text"
                                            className="w-full border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-blue-500 text-sm"
                                            value={data.nis}
                                            onChange={e => setData('nis', e.target.value)}
                                            placeholder="12345"
                                        />
                                        {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="w-full border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-blue-500 text-sm"
                                            value={data.nama}
                                            onChange={e => setData('nama', e.target.value)}
                                            placeholder="Budi Santoso"
                                        />
                                        {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Kelas</label>
                                        <select className="w-full border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" value={data.kelas_id} onChange={e => setData('kelas_id', e.target.value)}>
                                            <option value="">- Pilih -</option>
                                            {kelas_list.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                        </select>
                                        {errors.kelas_id && <p className="text-red-500 text-xs mt-1">{errors.kelas_id}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">L/P</label>
                                        <select className="w-full border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)}>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Divider Akun */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4 mt-2">
                                    <h4 className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <Lock className="w-4 h-4" /> Akun Login Siswa
                                    </h4>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Email</label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="email"
                                                    className="w-full border-gray-300 dark:border-gray-600 rounded-lg pl-10 dark:bg-gray-700 dark:text-white focus:ring-blue-500 text-sm"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    placeholder="siswa@sekolah.id"
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
                                                Password {isEdit && <span className="text-gray-400 dark:text-gray-500 font-normal text-xs">(Kosongkan jika tidak diubah)</span>}
                                            </label>
                                            <div className="relative">
                                                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="password"
                                                    className="w-full border-gray-300 dark:border-gray-600 rounded-lg pl-10 dark:bg-gray-700 dark:text-white focus:ring-blue-500 text-sm"
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    placeholder="******"
                                                />
                                            </div>
                                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 md:pt-4 flex flex-col sm:flex-row justify-end gap-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                                    <button type="button" onClick={closeModal} className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
