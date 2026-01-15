import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in - E- NGAJER" />

            <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-teal-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>

                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Left Side - Illustration */}
                    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-12 relative">
                        {/* Logo - Top Left */}
                        <div className="absolute top-8 left-8">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/icons/logosisabar.png"
                                    alt="SI SABAR Logo"
                                    className="w-16 h-16 object-contain"
                                />
                                <div>
                                    <h1 className="text-xl font-bold text-teal-800">E- NGAJER</h1>
                                    <p className="text-xs text-teal-600">Sistem Informasi Santri Belajar</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Illustration */}
                        <div className="relative w-full max-w-md">
                            {/* Decorative Background Shape */}
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-100/40 to-emerald-100/40 rounded-full blur-3xl transform -rotate-6"></div>

                            {/* Image Container */}
                            <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                                <img
                                    src="/images/santri.png"
                                    alt="Ilustrasi Santri"
                                    className="w-full h-auto object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="text-center py-12"><svg class="w-24 h-24 mx-auto text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg><p class="text-teal-600 mt-4 font-medium">Ilustrasi Santri Belajar</p></div>';
                                    }}
                                />
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-teal-400/20 rounded-full"></div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-400/20 rounded-full"></div>
                        </div>

                        {/* Bottom Text */}
                        <div className="absolute bottom-8 left-8 right-8 text-center">
                            <p className="text-sm text-teal-700">
                                © 2026 E- NGAJER. All rights reserved.
                            </p>
                            <p className="text-xs text-teal-600 mt-1">Powered by kyysolutions</p>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="flex items-center justify-center p-8 sm:p-12 bg-white lg:bg-gradient-to-br lg:from-emerald-700 lg:via-teal-600 lg:to-teal-700">
                        <div className="w-full max-w-md">
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex justify-center mb-8">
                                <img
                                    src="/images/icons/logosisabar.png"
                                    alt="E- NGAJER Logo"
                                    className="w-24 h-24 object-contain drop-shadow-xl"
                                />
                            </div>

                            {/* Login Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-teal-800 lg:text-white mb-2">Login</h2>
                                <p className="text-teal-600 lg:text-teal-100">Masuk ke sistem informasi santri</p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-teal-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm font-medium text-white">{status}</p>
                                    </div>
                                </div>
                            )}

                            {/* Login Form */}
                            <div className="space-y-5">
                                {/* Email/Username Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Username"
                                        className="block text-sm font-medium text-teal-800 lg:text-white mb-2"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full px-4 py-3 bg-gray-50 lg:bg-white/10 lg:backdrop-blur-sm border border-gray-300 lg:border-white/20 rounded-xl text-gray-900 lg:text-white placeholder-gray-500 lg:placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 lg:focus:ring-white/50 focus:border-transparent transition-all"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your username"
                                    />
                                    <InputError message={errors.email} className="mt-2 text-red-500 lg:text-red-200" />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="block text-sm font-medium text-teal-800 lg:text-white mb-2"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-3 bg-gray-50 lg:bg-white/10 lg:backdrop-blur-sm border border-gray-300 lg:border-white/20 rounded-xl text-gray-900 lg:text-white placeholder-gray-500 lg:placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 lg:focus:ring-white/50 focus:border-transparent transition-all"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !processing) {
                                                submit(e);
                                            }
                                        }}
                                        placeholder="Enter your password"
                                    />
                                    <InputError message={errors.password} className="mt-2 text-red-500 lg:text-red-200" />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="rounded border-gray-300 lg:border-white/30 bg-gray-50 lg:bg-white/10 text-teal-600 lg:text-teal-400 focus:ring-teal-500 lg:focus:ring-white/50"
                                        />
                                        <span className="ml-2 text-sm text-teal-700 lg:text-teal-100 group-hover:text-teal-900 lg:group-hover:text-white transition-colors">
                                            Ingat saya
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-teal-600 lg:text-teal-100 hover:text-teal-800 lg:hover:text-white transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    )}
                                </div>

                                {/* Login Button */}
                                <div className="pt-2">
                                    <PrimaryButton
                                        onClick={submit}
                                        className="w-full justify-center py-3.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-emerald-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            'Masuk ke Dashboard'
                                        )}
                                    </PrimaryButton>
                                </div>
                            </div>

                            {/* Footer Links */}
                            <div className="mt-8 pt-6 border-t border-gray-200 lg:border-white/10">
                                <div className="flex justify-center gap-6 text-sm text-teal-600 lg:text-teal-100">
                                    <a href="#" className="hover:text-teal-800 lg:hover:text-white transition-colors">
                                        Terms and Services
                                    </a>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-teal-700 lg:text-teal-200">
                                        Have a problem?{' '}
                                        <a href="#" className="text-teal-800 lg:text-white hover:underline">
                                            Contact us at
                                        </a>
                                    </p>
                                    <a href="mailto:kyysolutions17@gmail.com" className="text-xs text-teal-800 lg:text-white hover:underline">
                                        kyysolutions17@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
