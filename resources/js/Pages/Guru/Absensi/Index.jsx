import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Absensi Siswa</h2>}>
            <Head title="Absensi Siswa" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* FILTER KELAS */}
                <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-bold">Pilih Kelas</label>
                        <select className="w-full border p-2 rounded" value={selectedKelas} onChange={e => setSelectedKelas(e.target.value)}>
                            <option value="">- Pilih -</option>
                            {kelas_list.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                        </select>
                    </div>
                    <button onClick={handleFilter} className="bg-teal-600 text-white px-6 py-2 rounded h-10">Tampilkan Siswa</button>
                </div>

                {/* TABEL ABSENSI */}
                {siswas.length > 0 && (
                    <div className="bg-white p-6 rounded shadow">
                        <form onSubmit={submitAbsensi}>
                            <div className="flex justify-between mb-4">
                                <h3 className="font-bold text-lg">Daftar Siswa</h3>
                                <input type="date" className="border p-1 rounded" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} />
                            </div>
                            <table className="w-full border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2 border text-left">Nama Siswa</th>
                                        <th className="p-2 border text-center w-64">Status Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {siswas.map((siswa, idx) => (
                                        <tr key={siswa.id}>
                                            <td className="p-2 border">{siswa.nama} <span className="text-xs text-gray-500">({siswa.nis})</span></td>
                                            <td className="p-2 border">
                                                <div className="flex justify-center gap-2">
                                                    {['Hadir', 'Sakit', 'Izin', 'Alpha'].map(status => (
                                                        <label key={status} className="cursor-pointer flex items-center gap-1 text-sm">
                                                            <input
                                                                type="radio"
                                                                name={`status-${siswa.id}`}
                                                                value={status}
                                                                checked={data.absensi.find(a => a.siswa_id === siswa.id)?.status === status}
                                                                onChange={() => handleStatusChange(siswa.id, status)}
                                                            />
                                                            <span className={`
                                                                ${status === 'Hadir' ? 'text-green-600' : ''}
                                                                ${status === 'Alpha' ? 'text-red-600' : ''}
                                                            `}>{status[0]}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 text-right">
                                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-8 py-2 rounded font-bold hover:bg-blue-700">
                                    SIMPAN ABSENSI
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
