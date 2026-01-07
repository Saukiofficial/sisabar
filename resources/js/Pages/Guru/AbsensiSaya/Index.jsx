import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle, XCircle, Loader2, RefreshCw, QrCode, Clock, Calendar } from 'lucide-react';

export default function AbsensiSaya({ auth, histories }) {
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
                qr_token: decodedText,
                lokasi: 'GPS-Dummy',
                device_info: navigator.userAgent
            }, {
                preserveScroll: true,
                onSuccess: (page) => {
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
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white">Scan Kehadiran</h2>}>
            <Head title="Absensi Saya" />
            <div className="py-6 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                {/* SCANNER AREA */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px]">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-center text-base sm:text-lg text-gray-800 dark:text-white">Scan QR Code Admin</h3>
                    </div>

                    {status === 'idle' && (
                        <div className="w-full flex flex-col items-center">
                            <div id="reader" className="w-full max-w-sm rounded-lg overflow-hidden"></div>
                            <div className="mt-4 sm:mt-6 text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 max-w-sm">
                                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                                    📱 Arahkan kamera ke QR Code di meja piket untuk absen
                                </p>
                            </div>
                        </div>
                    )}

                    {status === 'processing' && (
                        <div className="text-center py-8 sm:py-10">
                            <Loader2 className="w-12 sm:w-16 h-12 sm:h-16 text-blue-500 dark:text-blue-400 animate-spin mx-auto mb-3 sm:mb-4" />
                            <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Memproses Data...</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">Mohon tunggu sebentar</p>
                        </div>
                    )}

                    {status === 'success' && !flash?.error && (
                        <div className="text-center py-8 sm:py-10 px-4">
                            <div className="relative inline-block mb-4 sm:mb-6">
                                <CheckCircle className="w-16 sm:w-20 h-16 sm:h-20 text-green-500 dark:text-green-400 mx-auto" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full animate-ping"></div>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Berhasil!</h4>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-sm mx-auto">
                                {flash?.message || 'Data kehadiran Anda berhasil tersimpan.'}
                            </p>
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition shadow-lg"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="font-medium">Scan Lagi</span>
                            </button>
                        </div>
                    )}

                    {(status === 'error' || flash?.error) && (
                        <div className="text-center py-8 sm:py-10 px-4 w-full max-w-md">
                            <XCircle className="w-16 sm:w-20 h-16 sm:h-20 text-red-500 dark:text-red-400 mx-auto mb-4 sm:mb-6" />
                            <h4 className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mb-3 sm:mb-4">Gagal!</h4>

                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8 text-left">
                                <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 break-words">
                                    {flash?.error || errors?.qr_token || 'Terjadi kesalahan. Coba scan ulang.'}
                                </p>
                            </div>

                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 bg-red-600 dark:bg-red-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition shadow-lg"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="font-medium">Coba Lagi</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* RIWAYAT LIST */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                    <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-white">Riwayat Kehadiran</h3>
                    </div>

                    <div className="space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {histories.length === 0 ? (
                            <div className="text-center py-8 sm:py-10">
                                <Calendar className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-3" />
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Belum ada riwayat kehadiran</p>
                            </div>
                        ) : (
                            histories.map((h) => (
                                <div
                                    key={h.id}
                                    className="group flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 border-l-4 border-indigo-500 dark:border-indigo-400 bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-r-lg hover:bg-white dark:hover:bg-gray-600 hover:shadow-md transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
                                            <div className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">{h.tanggal}</div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 ml-5 sm:ml-6">
                                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            Masuk: <span className="font-semibold">{h.jam_masuk}</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 sm:ml-0">
                                        {h.jam_pulang ? (
                                            <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                                                <CheckCircle className="w-3 h-3" />
                                                Pulang: {h.jam_pulang}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                                                <Clock className="w-3 h-3" />
                                                Belum pulang
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Style */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4b5563;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
