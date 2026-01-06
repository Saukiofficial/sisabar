import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function QrDisplay({ auth, qrCode, date }) {

    // Auto refresh halaman setiap 5 menit agar QR Code tidak stale (opsional)
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Layar Absensi QR</h2>}>
            <Head title="Scan QR Code" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 h-screen max-h-[80vh]">
                <div className="bg-white overflow-hidden shadow-2xl sm:rounded-xl h-full flex flex-col items-center justify-center text-center p-8 border-4 border-indigo-100">

                    <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight">ABSENSI GURU</h1>
                    <p className="text-xl text-gray-500 font-medium mb-8 bg-gray-100 px-6 py-2 rounded-full">
                        {date}
                    </p>

                    {/* Container QR Code */}
                    <div className="p-6 bg-white border-4 border-dashed border-indigo-300 rounded-xl shadow-inner mb-6">
                        {/* Render SVG dari Controller */}
                        <div
                            className="scale-125"
                            dangerouslySetInnerHTML={{ __html: qrCode }}
                        />
                    </div>

                    <div className="max-w-md text-gray-600">
                        <p className="mb-2 font-semibold">Petunjuk:</p>
                        <ol className="text-sm list-decimal list-inside space-y-1 text-left inline-block">
                            <li>Buka Aplikasi Jurnal Guru di HP Anda.</li>
                            <li>Pilih menu <strong>"Scan Kehadiran"</strong>.</li>
                            <li>Arahkan kamera ke kode QR di atas.</li>
                        </ol>
                    </div>

                    <div className="mt-10 text-xs text-gray-400">
                        Otomatis refresh setiap 5 menit. Pastikan layar tetap menyala.
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
