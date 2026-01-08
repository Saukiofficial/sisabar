import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Camera, Save, User, Mail, Lock, AlertCircle,
    Key, Trash2, CheckCircle
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    // --- 1. LOGIC EDIT PROFIL (NAMA, EMAIL, AVATAR) ---
    const fileInput = useRef(null);
    const [preview, setPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);

    const {
        data: dataProfile,
        setData: setDataProfile,
        post: postProfile,
        processing: processingProfile,
        errors: errorsProfile,
        reset: resetProfile
    } = useForm({
        _method: 'PATCH',
        name: user.name,
        email: user.email,
        avatar: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDataProfile('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        postProfile(route('profile.update'), {
            onSuccess: () => resetProfile('avatar'),
            preserveScroll: true
        });
    };

    // --- 2. LOGIC GANTI PASSWORD ---
    const {
        data: dataPassword,
        setData: setDataPassword,
        put: putPassword,
        processing: processingPassword,
        errors: errorsPassword,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        putPassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
            onError: () => {
                if (errorsPassword.password) {
                    resetPassword('password', 'password_confirmation');
                }
                if (errorsPassword.current_password) {
                    resetPassword('current_password');
                }
            },
        });
    };

    // --- 3. LOGIC HAPUS AKUN ---
    const {
        data: dataDelete,
        setData: setDataDelete,
        delete: deleteUser,
        processing: processingDelete,
        errors: errorsDelete,
        reset: resetDelete
    } = useForm({
        password: '',
    });

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const deleteUserHandler = (e) => {
        e.preventDefault();
        deleteUser(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setConfirmingUserDeletion(false),
            onFinish: () => resetDelete(),
        });
    };

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Pengaturan Akun</h2>}
        >
            <Head title="Profil & Keamanan" />

            <div className="py-12 max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">

                {/* === BAGIAN 1: PROFIL & FOTO === */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <header className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" /> Informasi Profil
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Perbarui informasi profil akun dan alamat email Anda.
                        </p>
                    </header>

                    <form onSubmit={submitProfile} encType="multipart/form-data">
                        <div className="flex flex-col md:flex-row gap-8 items-start">

                            {/* Upload Foto */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="relative group cursor-pointer" onClick={() => fileInput.current.click()}>
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 shadow-md">
                                        {preview ? (
                                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                                <User className="w-16 h-16" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                    <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">Klik foto untuk ubah</p>
                                {errorsProfile.avatar && <p className="text-red-500 text-xs mt-1">{errorsProfile.avatar}</p>}
                            </div>

                            {/* Input Form */}
                            <div className="flex-1 w-full space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                        value={dataProfile.name}
                                        onChange={(e) => setDataProfile('name', e.target.value)}
                                        required
                                    />
                                    {errorsProfile.name && <p className="text-red-500 text-xs mt-1">{errorsProfile.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                        value={dataProfile.email}
                                        onChange={(e) => setDataProfile('email', e.target.value)}
                                        required
                                    />
                                    {errorsProfile.email && <p className="text-red-500 text-xs mt-1">{errorsProfile.email}</p>}
                                </div>

                                {mustVerifyEmail && user.email_verified_at === null && (
                                    <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                                        Email belum diverifikasi.{' '}
                                        <Link href={route('verification.send')} method="post" as="button" className="underline font-bold">
                                            Kirim ulang verifikasi.
                                        </Link>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-2">
                                    <button type="submit" disabled={processingProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                                        Simpan Profil
                                    </button>
                                    {status === 'profile-updated' && (
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" /> Tersimpan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </section>

                {/* === BAGIAN 2: GANTI PASSWORD === */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <header className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Key className="w-5 h-5 text-orange-500" /> Ganti Password
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
                        </p>
                    </header>

                    <form onSubmit={submitPassword} className="space-y-4 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Saat Ini</label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:ring-orange-500 focus:border-orange-500"
                                value={dataPassword.current_password}
                                onChange={(e) => setDataPassword('current_password', e.target.value)}
                                ref={(input) => { if(errorsPassword.current_password) input?.focus(); }}
                            />
                            {errorsPassword.current_password && <p className="text-red-500 text-xs mt-1">{errorsPassword.current_password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Baru</label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:ring-orange-500 focus:border-orange-500"
                                value={dataPassword.password}
                                onChange={(e) => setDataPassword('password', e.target.value)}
                            />
                            {errorsPassword.password && <p className="text-red-500 text-xs mt-1">{errorsPassword.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:ring-orange-500 focus:border-orange-500"
                                value={dataPassword.password_confirmation}
                                onChange={(e) => setDataPassword('password_confirmation', e.target.value)}
                            />
                            {errorsPassword.password_confirmation && <p className="text-red-500 text-xs mt-1">{errorsPassword.password_confirmation}</p>}
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button type="submit" disabled={processingPassword} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition">
                                Update Password
                            </button>
                            {processingPassword && <span className="text-sm text-gray-500">Memproses...</span>}
                        </div>
                    </form>
                </section>

                {/* === BAGIAN 3: HAPUS AKUN === */}
                <section className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <header className="mb-4">
                        <h2 className="text-lg font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Hapus Akun
                        </h2>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                            Setelah akun dihapus, semua data akan hilang permanen. Harap unduh data penting sebelum melanjutkan.
                        </p>
                    </header>

                    {!confirmingUserDeletion ? (
                        <button
                            onClick={() => setConfirmingUserDeletion(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition"
                        >
                            Hapus Akun Saya
                        </button>
                    ) : (
                        <form onSubmit={deleteUserHandler} className="max-w-xl space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-200">
                            <p className="text-sm font-bold text-gray-800 dark:text-white">
                                Apakah Anda yakin? Masukkan password untuk konfirmasi.
                            </p>
                            <input
                                type="password"
                                className="w-full rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:ring-red-500 focus:border-red-500"
                                placeholder="Password Anda"
                                value={dataDelete.password}
                                onChange={(e) => setDataDelete('password', e.target.value)}
                                ref={(input) => input?.focus()}
                            />
                            {errorsDelete.password && <p className="text-red-500 text-xs">{errorsDelete.password}</p>}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setConfirmingUserDeletion(false); resetDelete(); }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                                >
                                    Ya, Hapus Permanen
                                </button>
                            </div>
                        </form>
                    )}
                </section>

            </div>
        </AuthenticatedLayout>
    );
}
