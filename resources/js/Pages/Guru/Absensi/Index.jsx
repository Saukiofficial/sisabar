import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function AbsensiIndex({ auth, kelas_list, siswas, kelas_selected }) {
    // State untuk form pencarian kelas
    const [selectedKelas, setSelectedKelas] = useState(kelas_selected || '');

    // Form Data untuk simpan absensi
    const { data, setData, post, processing } = useForm({
        kelas_id: kelas_selected,
        tanggal: new Date().toISOString().split('T')[0],
        absensi: []
    });

    // Saat load, populate data absensi default (Hadir semua)
    useEffect(() => {
        if (siswas.length > 0) {
            const initialAbsensi = siswas.map(siswa => ({
                siswa_id: siswa.id,
                status: 'Hadir'
            }));
            setData(prev => ({ ...prev, absensi: initialAbsensi }));
        }
    }, [siswas]);

    const handleFilter = () => {
        router.get(route('guru.absensi.index'), { kelas_id: selectedKelas });
    };

    const handleStatusChange = (siswaId, status) => {
        const updatedAbsensi = data.absensi.map(item =>
            item.siswa_id === siswaId ? { ...item, status: status } : item
        );
        setData('absensi', updatedAbsensi);
    };

    const submitAbsensi = (e) => {
        e.preventDefault();
        post(route('guru.absensi.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white">Absensi Siswa</h2>}>
            <Head title="Absensi Siswa" />
            <div className="py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* FILTER KELAS */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <h3 className="font-bold text-gray-800 dark:text-white">Filter Kelas</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Kelas</label>
                            <select
                                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2"
                                value={selectedKelas}
                                onChange={e => setSelectedKelas(e.target.value)}
                            >
                                <option value="">- Pilih Kelas -</option>
                                {kelas_list.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleFilter}
                            className="bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition sm:mt-6"
                        >
                            Tampilkan Siswa
                        </button>
                    </div>
                </div>

                {/* TABEL ABSENSI */}
                {siswas.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <form onSubmit={submitAbsensi}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Daftar Siswa</h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">({siswas.length} siswa)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <input
                                        type="date"
                                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={data.tanggal}
                                        onChange={e => setData('tanggal', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Siswa</th>
                                            <th className="p-3 border-b border-gray-200 dark:border-gray-600 text-center w-80 text-sm font-semibold text-gray-700 dark:text-gray-300">Status Kehadiran</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {siswas.map((siswa) => (
                                            <tr key={siswa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                <td className="p-3 text-gray-800 dark:text-gray-200">
                                                    {siswa.nama}
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({siswa.nis})</span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-4">
                                                        {['Hadir', 'Sakit', 'Izin', 'Alpha'].map(status => (
                                                            <label key={status} className="cursor-pointer flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="radio"
                                                                    name={`status-${siswa.id}`}
                                                                    value={status}
                                                                    checked={data.absensi.find(a => a.siswa_id === siswa.id)?.status === status}
                                                                    onChange={() => handleStatusChange(siswa.id, status)}
                                                                    className="text-teal-600 focus:ring-teal-500"
                                                                />
                                                                <span className={`font-medium
                                                                    ${status === 'Hadir' ? 'text-green-600 dark:text-green-400' : ''}
                                                                    ${status === 'Sakit' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                                                                    ${status === 'Izin' ? 'text-blue-600 dark:text-blue-400' : ''}
                                                                    ${status === 'Alpha' ? 'text-red-600 dark:text-red-400' : ''}
                                                                `}>{status}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {siswas.map((siswa) => (
                                    <div key={siswa.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                        <div className="font-medium text-gray-800 dark:text-white mb-2">
                                            {siswa.nama}
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({siswa.nis})</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Hadir', 'Sakit', 'Izin', 'Alpha'].map(status => (
                                                <label key={status} className={`cursor-pointer flex items-center justify-center gap-2 p-2 rounded border-2 transition
                                                    ${data.absensi.find(a => a.siswa_id === siswa.id)?.status === status
                                                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                                                        : 'border-gray-200 dark:border-gray-600'
                                                    }
                                                `}>
                                                    <input
                                                        type="radio"
                                                        name={`status-${siswa.id}`}
                                                        value={status}
                                                        checked={data.absensi.find(a => a.siswa_id === siswa.id)?.status === status}
                                                        onChange={() => handleStatusChange(siswa.id, status)}
                                                        className="hidden"
                                                    />
                                                    <span className={`text-sm font-medium
                                                        ${status === 'Hadir' ? 'text-green-600 dark:text-green-400' : ''}
                                                        ${status === 'Sakit' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                                                        ${status === 'Izin' ? 'text-blue-600 dark:text-blue-400' : ''}
                                                        ${status === 'Alpha' ? 'text-red-600 dark:text-red-400' : ''}
                                                    `}>{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2.5 rounded-lg font-bold transition shadow-lg shadow-blue-200 dark:shadow-blue-900/50 w-full sm:w-auto"
                                >
                                    {processing ? 'Menyimpan...' : 'SIMPAN ABSENSI'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Empty State */}
                {siswas.length === 0 && selectedKelas && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <XCircle className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-500 dark:text-gray-400">Tidak ada siswa di kelas yang dipilih.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
