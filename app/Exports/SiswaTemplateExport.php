<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class SiswaTemplateExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    /**
     * Header kolom untuk template Excel
     */
    public function headings(): array
    {
        return [
            'nis',
            'nama_lengkap',
            'kelas',        // Contoh: X IPA 1 (Harus sesuai nama di database)
            'jenis_kelamin', // L atau P
            'email',        // Opsional
            'password'      // Opsional
        ];
    }

    /**
     * Data kosong (karena ini cuma template untuk diisi user)
     */
    public function collection()
    {
        return collect([]);
    }
}
