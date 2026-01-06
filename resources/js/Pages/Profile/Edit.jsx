import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { User, Shield, AlertTriangle } from 'lucide-react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Pengaturan Akun"
        >
            <Head title="Profile" />

            <div className="space-y-8">

                {/* 1. HEADER BANNER */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/10">
                            {auth.user.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">{auth.user.name}</h2>
                            <p className="opacity-80 mt-1">{auth.user.email}</p>
                            <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md border border-white/10">
                                Akun Pengguna
                            </span>
                        </div>
                    </div>
                    {/* Dekorasi */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* 2. UPDATE PROFILE INFO */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Informasi Profil</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Perbarui nama dan email akun Anda.</p>
                            </div>
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* 3. UPDATE PASSWORD */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Keamanan</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Perbarui kata sandi untuk keamanan.</p>
                            </div>
                        </div>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>

                {/* 4. DELETE ACCOUNT (Danger Zone) */}
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-800/30">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Area Berbahaya</h3>
                    </div>
                    <DeleteUserForm className="max-w-xl" />
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
