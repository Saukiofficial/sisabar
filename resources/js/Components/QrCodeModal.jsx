import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';

export default function QrCodeModal({ show, onClose, user, type = 'Siswa' }) {
    if (!show || !user) return null;

    const handlePrint = () => {
        window.print();
    };

    // Tentukan data yang mau ditampilkan
    const name = user.user?.name || user.name || 'Nama Tidak Ada';

    // Gunakan String() untuk memastikan data tidak error di QRCode
    const kode = String(user.nis || user.nip || user.user?.username || '-');

    const label = type === 'Siswa' ? 'NIS' : 'NIP';
    const kelas = user.kelas?.nama_kelas || '-';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity modal-print-container">

            {/* Area Luar Modal (Klik untuk tutup) */}
            <div className="absolute inset-0 no-print" onClick={onClose}></div>

            {/* Kartu ID untuk Tampilan Layar & Cetak */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 print-card">

                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 transition no-print"
                >
                    <X size={20} />
                </button>

                {/* Konten Kartu */}
                <div className="p-8 flex flex-col items-center text-center border-4 border-double border-blue-100 m-4 rounded-xl print-content">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1 tracking-wide uppercase">KARTU TANDA {type}</h2>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-6">SMART CLASS SYSTEM</p>

                    <div className="bg-white p-3 rounded-xl shadow-inner border border-gray-200 mb-6 qr-box">
                        <QRCodeSVG
                            value={kode}
                            size={180}
                            level="H"
                            includeMargin={true}
                        />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{name}</h3>

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-300 w-full mb-6">
                        <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg info-pill">
                            <span className="block text-xs text-gray-500 uppercase">{label}</span>
                            <span className="font-mono font-bold">{kode}</span>
                        </div>
                        {type === 'Siswa' && (
                            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg info-pill">
                                <span className="block text-xs text-gray-500 uppercase">KELAS</span>
                                <span className="font-bold">{kelas}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-blue-600/30 no-print"
                    >
                        <Printer size={18} />
                        Cetak Kartu
                    </button>
                </div>
            </div>

            <style>{`
                @media print {
                    /* 1. Sembunyikan SEMUA elemen root */
                    body * {
                        visibility: hidden;
                    }

                    /* 2. Sembunyikan elemen overlay & tombol */
                    .no-print {
                        display: none !important;
                    }

                    /* 3. Tampilkan HANYA container modal kita */
                    .modal-print-container,
                    .modal-print-container * {
                        visibility: visible !important;
                    }

                    /* 4. Posisikan Kartu di tengah kertas */
                    .modal-print-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        background: white !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 99999;
                    }

                    /* 5. Styling khusus Kartu saat diprint */
                    .print-card {
                        box-shadow: none !important;
                        border: 2px solid #000 !important;
                        width: 350px !important;
                        height: auto !important;
                        background: white !important;
                        color: black !important;
                        position: static !important; /* Reset position */
                    }

                    .print-content {
                        margin: 0 !important;
                        border: none !important;
                    }

                    /* Paksa teks jadi hitam pekat */
                    h2, h3, p, span {
                        color: black !important;
                        -webkit-print-color-adjust: exact;
                    }

                    .info-pill {
                        border: 1px solid #ccc !important;
                        background: white !important;
                    }

                    .qr-box {
                        border: 1px solid #000 !important;
                    }
                }
            `}</style>
        </div>
    );
}
