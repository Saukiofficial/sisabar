<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapelController extends Controller
{
    public function index()
    {
        $mapel = Mapel::latest()->get();
        return Inertia::render('Admin/Mapel/Index', ['mapel' => $mapel]);
    }

    public function store(Request $request)
    {
        $request->validate(['nama_mapel' => 'required']);
        Mapel::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, Mapel $mapel)
    {
        $request->validate(['nama_mapel' => 'required']);
        $mapel->update($request->all());
        return redirect()->back();
    }

    public function destroy(Mapel $mapel)
    {
        $mapel->delete();
        return redirect()->back();
    }
}
