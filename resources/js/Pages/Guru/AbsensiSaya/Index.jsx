import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react'; // Ganti useForm dengan router
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

export default function AbsensiSaya({ auth, histories }) {
    // Kita ambil errors & flash langsung dari props page, bukan useForm
    const { errors, flash = {} } = usePage().props;

    const [scanResult, setScanResult] = useState(null);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        let scanner;
        if (status === 'idle') {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );
            scanner.render(onScanSuccess, onScanFailure);
        }

        function onScanSuccess(decodedText, decodedResult) {
            setScanResult(decodedText);
            setStatus('processing');

            if(scanner) {
                scanner.clear().catch(err => console.error(err));
            }


            router.post(route('guru.absensi-saya.store'), {
                // Data dikirim di sini (argumen ke-2)
                qr_token: decodedText,
                lokasi: 'GPS-Dummy',
                device_info: navigator.userAgent
            }, {
                // Options (argumen ke-3)
                preserveScroll: true,
                onSuccess: (page) => {
                    // Cek flash message dari response server
                    if (page.props.flash?.error) {
                        setStatus('error');
                    } else {
                        setStatus('success');
                    }
                },
                onError: (errors) => {
                    setStatus('error');
                }
            });
        }

        function onScanFailure(error) {}

        return () => {
            if (scanner) scanner.clear().catch(e => console.error(e));
        };
    }, [status]);

    // Pantau perubahan flash message secara reaktif
    useEffect(() => {
        if (flash?.error && status === 'processing') {
            setStatus('error');
        }
    }, [flash, status]);

    const handleReset = () => {
        setScanResult(null);
        setStatus('idle');

    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Scan Kehadiran</h2>}>
            <Head title="Absensi Saya" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* SCANNER AREA */}
                <div className="bg-white p-6 rounded shadow flex flex-col items-center justify-center min-h-[400px]">
                    <h3 className="font-bold mb-4 text-center text-lg">Scan QR Code Admin</h3>

                    {status === 'idle' && (
                        <>
                            <div id="reader" className="w-full max-w-sm"></div>
                            <p className="text-xs text-gray-500 text-center mt-4">Arahkan kamera ke layar QR Code di meja piket.</p>
                        </>
                    )}

                    {status === 'processing' && (
                        <div className="text-center py-10">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                            <p className="text-lg font-semibold text-gray-700">Memproses Data...</p>
                        </div>
                    )}

                    {status === 'success' && !flash?.error && (
                        <div className="text-center py-10">
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <h4 className="text-2xl font-bold text-green-600 mb-2">Berhasil!</h4>
                            <p className="text-gray-600 mb-6">{flash?.message || 'Data kehadiran tersimpan.'}</p>
                            <button onClick={handleReset} className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition">
                                <RefreshCw className="w-4 h-4" /> Scan Lagi
                            </button   >
                        </div>
                    )}

                    {(status === 'error' || flash?.error) && (
                        <div className="text-center py-10 px-4">
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                            <h4 className="text-2xl font-bold text-red-600 mb-2">Gagal!</h4>

                            <div className="bg-red-50 border border-red-200 rounded p-3 mb-6 text-sm text-red-800 break-all font-mono">
                                {flash?.error || errors?.qr_token || 'Terjadi kesalahan. Coba scan ulang.'}
                            </div>

                            <button onClick={handleReset} className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition">
                                <RefreshCw className="w-4 h-4" /> Coba Lagi
                            </button>
                        </div>
                    )}
                </div>

                {/* RIWAYAT LIST */}
                <div className="bg-white p-6 rounded shadow h-fit">
                    <h3 className="font-bold mb-4 text-lg border-b pb-2">Riwayat Kehadiran</h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {histories.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Belum ada riwayat.</p>
                        ) : (
                            histories.map((h) => (
                                <div key={h.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <div>
                                        <div className="font-bold text-gray-800">{h.tanggal}</div>
                                        <div className="text-xs text-blue-600">Masuk: {h.jam_masuk}</div>
                                    </div>
                                    <div>
                                        {h.jam_pulang ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Pulang: {h.jam_pulang}</span> : <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">--:--</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
