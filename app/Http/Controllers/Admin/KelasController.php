<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::orderBy('nama_kelas')->get();
        return Inertia::render('Admin/Kelas/Index', ['kelas' => $kelas]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:kelas,nama_kelas'
        ]);

        Kelas::create($request->all());

        return redirect()->back()->with('message', 'Kelas berhasil ditambahkan.');
    }


    public function update(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id); // Cari manual biar aman

        $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:kelas,nama_kelas,' . $id
        ]);

        $kelas->update($request->all());

        return redirect()->back()->with('message', 'Data kelas berhasil diperbarui.');
    }


    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id); // Cari manual biar aman
        $kelas->delete();

        return redirect()->back()->with('message', 'Kelas berhasil dihapus.');
    }
}
