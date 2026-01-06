import React, { useState } from 'react';
// PERBAIKAN IMPORT PATH: Menggunakan path relatif ../../../
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '../../../Components/Modal';
import {
    Search, FileText, CheckCircle, XCircle, Eye,
    AlertCircle, User, Calendar, CheckSquare, Maximize2
} from 'lucide-react';

export default function SupervisiIndex({ auth, perangkats, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [actionType, setActionType] = useState('');

    // LIST ITEM CHECKLIST SESUAI FORMAT PDF (BAGIAN II)
    const checklistItems = [
        {
            category: 'A. Perangkat Pembelajaran',
            items: [
                'Capaian Pembelajaran (CP)',
                'Tujuan Pembelajaran (TP)',
                'Alur Tujuan Pembelajaran (ATP)',
                'Modul Ajar / RPP',
                'Silabus / Kerangka Modul',
                'Program Tahunan (Prota)',
                'Program Semester (Prosem)'
            ]
        },
        {
            category: 'B. Kelengkapan Dokumen Modul Ajar',
            items: [
                'Identitas Modul (Nama Guru, Mapel, Fase)',
                'Komponen Inti (Tujuan, Pemahaman, Pertanyaan Pemantik)',
                'Komponen Asesmen (Diagnostik, Formatif, Sumatif)',
                'Pengayaan dan Remedial',
                'Refleksi Guru dan Peserta Didik'
            ]
        },
        {
            category: 'C. Materi / Sumber Ajar Pendukung',
            items: [
                'Buku Teks / Panduan Guru',
                'Lembar Kerja Peserta Didik (LKPD)',
                'Bahan Tayang (PPT, Video, dll)',
                'Media Pembelajaran'
            ]
        }
    ];

    const { data, setData, put, processing, reset, errors } = useForm({
        status: '',
        catatan_revisi: '',
        checklist: [] // Array untuk menyimpan item yang dicentang
    });

    // Handle Search
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('kepsek.supervisi.index'), { search: searchQuery }, { preserveState: true });
        }
    };

    // Buka Modal Validasi
    const openValidationModal = (doc, type) => {
        setSelectedDoc(doc);
        setActionType(type);

        let initialChecklist = [];
        if (doc.checklist && doc.checklist.length > 0) {
            initialChecklist = doc.checklist;
        } else if (type === 'Valid') {
            initialChecklist = checklistItems.flatMap(g => g.items);
        }

        setData({
            status: type,
            catatan_revisi: doc.catatan_revisi || '',
            checklist: initialChecklist
        });

        setShowValidationModal(true);
    };

    // Handle Checkbox Change
    const handleCheckboxChange = (item) => {
        if (data.checklist.includes(item)) {
            setData('checklist', data.checklist.filter(i => i !== item));
        } else {
            setData('checklist', [...data.checklist, item]);
        }
    };

    const submitValidation = (e) => {
        e.preventDefault();
        put(route('kepsek.supervisi.update', selectedDoc.id), {
            onSuccess: () => {
                setShowValidationModal(false);
                reset();
                setSelectedDoc(null);
            }
        });
    };

    // Helper: Badge Status
    const renderStatusBadge = (status) => {
        const styles = {
            'Valid': 'bg-green-100 text-green-800 border-green-200',
            'Revisi': 'bg-red-100 text-red-800 border-red-200',
            'Menunggu': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['Menunggu']}`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Supervisi Perangkat Pembelajaran</h2>}
        >
            <Head title="Supervisi Guru" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- FILTER & SEARCH --- */}
                    <div className="mb-6 flex justify-between items-center">
                        <div className="relative w-full max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                                placeholder="Cari nama guru atau judul dokumen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* --- TABLE LIST --- */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Guru & Mapel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dokumen</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {perangkats.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            Tidak ada dokumen yang perlu diperiksa.
                                        </td>
                                    </tr>
                                ) : (
                                    perangkats.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                                        {item.guru?.user?.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.guru?.user?.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {item.mapel?.nama_mapel}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white font-medium">{item.judul}</div>
                                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded border mr-2">{item.jenis_perangkat}</span>
                                                    <Calendar className="w-3 h-3 mr-1"/>
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {renderStatusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end items-center gap-2">
                                                    {/* Validation Buttons */}
                                                    <button
                                                        onClick={() => openValidationModal(item, 'Valid')}
                                                        className={`p-2 rounded-lg transition ${item.status === 'Valid' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                                        title="Validasi / Setujui"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openValidationModal(item, 'Revisi')}
                                                        className={`p-2 rounded-lg transition ${item.status === 'Revisi' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                        title="Minta Revisi"
                                                    >
                                                        <XCircle className="w-4 h-4" />
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
            </div>

            {/* --- MODAL VALIDASI / REVISI --- */}
            <Modal show={showValidationModal} onClose={() => setShowValidationModal(false)} maxWidth="5xl"> {/* Ukuran Modal Lebih Besar */}
                <div className="flex h-[80vh]">
                    {/* --- KOLOM KIRI: PREVIEW FILE PDF --- */}
                    <div className="w-1/2 border-r border-gray-200 bg-gray-100 p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-gray-700 flex items-center">
                                <FileText className="w-4 h-4 mr-2"/>
                                Preview Dokumen
                            </h3>
                            <a
                                href={selectedDoc ? `/storage/${selectedDoc.file_path}` : '#'}
                                target="_blank"
                                className="text-blue-600 text-xs hover:underline flex items-center"
                            >
                                <Maximize2 className="w-3 h-3 mr-1"/> Buka Tab Baru
                            </a>
                        </div>
                        <div className="flex-1 bg-white rounded shadow-sm overflow-hidden border">
                            {/* IFRAME PDF PREVIEW */}
                            {selectedDoc && (
                                <iframe
                                    src={`/storage/${selectedDoc.file_path}`}
                                    className="w-full h-full"
                                    title="Preview Dokumen"
                                ></iframe>
                            )}
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: FORM VALIDASI & CHECKLIST --- */}
                    <div className="w-1/2 p-6 overflow-y-auto">
                        <form onSubmit={submitValidation}>
                            <h2 className={`text-lg font-bold mb-4 flex items-center border-b pb-3 ${actionType === 'Valid' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}>
                                {actionType === 'Valid' ? <CheckCircle className="mr-2 w-6 h-6"/> : <AlertCircle className="mr-2 w-6 h-6"/>}
                                {actionType === 'Valid' ? 'Validasi Kelengkapan' : 'Permintaan Revisi'}
                            </h2>

                            <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded text-sm">
                                <strong>Guru:</strong> {selectedDoc?.guru?.user?.name} <br/>
                                <strong>Dokumen:</strong> {selectedDoc?.judul}
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                {actionType === 'Valid'
                                    ? `Periksa dokumen di sebelah kiri, lalu centang poin yang sudah sesuai (Bagian II) di bawah ini.`
                                    : `Berikan catatan kepada guru mengenai bagian dokumen yang perlu diperbaiki.`
                                }
                            </p>

                            {/* BAGIAN CHECKLIST (Hanya muncul jika VALID) */}
                            {actionType === 'Valid' && (
                                <div className="mb-6 space-y-5">
                                    {checklistItems.map((group, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 border-b pb-1 tracking-wider">{group.category}</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {group.items.map((item, i) => (
                                                    <label key={i} className="flex items-start space-x-3 text-sm text-gray-700 hover:bg-blue-50 p-2 rounded cursor-pointer transition select-none">
                                                        <input
                                                            type="checkbox"
                                                            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 w-4 h-4"
                                                            checked={data.checklist.includes(item)}
                                                            onChange={() => handleCheckboxChange(item)}
                                                        />
                                                        <span className={`${data.checklist.includes(item) ? 'font-medium text-gray-900' : ''}`}>
                                                            {item}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* FORM REVISI (Hanya muncul jika REVISI) */}
                            {actionType === 'Revisi' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Revisi <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={data.catatan_revisi}
                                        onChange={e => setData('catatan_revisi', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                        rows="6"
                                        placeholder="Contoh: Bab 2 tidak ada di file, mohon lengkapi..."
                                        required
                                    ></textarea>
                                    {errors.catatan_revisi && <p className="text-red-500 text-xs mt-1">{errors.catatan_revisi}</p>}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowValidationModal(false)}
                                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-4 py-2 text-white rounded-md text-sm font-bold shadow-sm flex items-center transition ${
                                        actionType === 'Valid' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {processing && <span className="mr-2 animate-spin">⟳</span>}
                                    {actionType === 'Valid' ? 'Simpan Validasi' : 'Kirim Revisi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
