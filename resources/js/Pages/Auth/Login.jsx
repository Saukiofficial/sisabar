import { Head, Link, useForm } from '@inertiajs/react';

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
            <Head title="Log in - E-NGAJER" />

            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Image Full Screen */}
                <div className="absolute inset-0">
                    <img
                        src="/images/background.png"
                        alt="Background Madura"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background = 'linear-gradient(to bottom right, #78350f, #991b1b, #92400e)';
                        }}
                    />
                    {/* Overlay Gradient untuk kontras */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40"></div>
                </div>

                {/* Batik Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 z-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>

                <div className="w-full max-w-7xl grid lg:grid-cols-5 gap-0 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden relative z-20">
                    {/* Left Side - Ilustrasi Budaya Madura */}
                    <div className="hidden lg:flex lg:col-span-3 items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50/90 via-yellow-50/80 to-red-50/90 backdrop-blur-sm p-12 pt-24">
                        {/* Batik Corner Decorations */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-red-800 opacity-20 z-10"></div>
                        <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-yellow-700 opacity-30 m-2 z-10"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-red-800 opacity-30 z-10"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-yellow-700 opacity-40 m-2 z-10"></div>

                        {/* Logo & Brand - Traditional Style */}
                        <div className="absolute top-6 left-12 right-12 z-30">
                            <div className="flex items-center gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border-2 border-red-800/20">
                                <div className="bg-gradient-to-br from-red-800 to-yellow-700 p-3 rounded-xl shadow-md">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-900 to-yellow-800 bg-clip-text text-transparent">E-NGAJER</h1>
                                    <p className="text-sm text-red-800 font-medium">Sistem Pangajaran Guru Madura</p>
                                    <p className="text-xs text-amber-700 italic">"Ngajar kalaben ateh "</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Illustration Area */}
                        <div className="relative w-full max-w-lg z-20">
                            {/* Decorative Background with Batik Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 to-yellow-100/60 rounded-full blur-3xl transform rotate-6"></div>

                            {/* Main Content Card */}
                            <div className="relative z-10 bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-yellow-800/20">
                                {/* Traditional Guru Illustration */}
                                <div className="relative bg-gradient-to-br from-amber-100 to-red-100 rounded-2xl p-6 mb-6 overflow-hidden">
                                    <img
                                        src="/images/guru.png"
                                        alt="Guru Madura"
                                        className="w-full h-64 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `
                                                <svg class="w-full h-64 text-red-900" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2L1 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-11-5zm0 2.18l9 4.09v8.73c0 4.83-3.13 9.37-7.93 10.72L12 27.82l-.07-.1C7.13 26.37 4 21.83 4 17V8.27l8-4.09zM12 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-6 8c0 2.67 2.33 4 6 4s6-1.33 6-4h-2c0 1.33-1.33 2-4 2s-4-.67-4-2H6z"/>
                                                </svg>
                                            `;
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                        Guru Madura
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="space-y-3 text-center">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-800 to-yellow-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                        </svg>
                                        Tradisi & Pendidikan
                                    </div>
                                    <p className="text-red-900 font-medium text-lg">
                                        Ngajar kalaben Tradisi Madura
                                    </p>
                                    <p className="text-amber-800 text-sm italic">
                                        "Pendidikan berbasis budaya lokal"
                                    </p>
                                </div>
                            </div>

                            {/* Floating Decorative Elements */}
                            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full opacity-20 animate-bounce"></div>
                            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                        </div>

                        {/* Bottom Section - Traditional Pattern */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                        <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                            <div className="inline-block bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-yellow-700/20">
                                <p className="text-sm text-red-900 font-semibold">
                                    © 2026 E-NGAJER Madura
                                </p>
                                <p className="text-xs text-amber-800 mt-1">Powered by kyysolutions</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="lg:col-span-2 flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-red-900/95 via-red-800/95 to-yellow-900/95 backdrop-blur-md relative overflow-hidden">
                        {/* Batik Pattern Overlay on Form Side */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>

                        <div className="w-full max-w-md relative z-10">
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex flex-col items-center mb-8">
                                <div className="bg-white p-4 rounded-2xl shadow-2xl mb-4">
                                    <svg className="w-16 h-16 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-white">E-NGAJER</h1>
                                <p className="text-yellow-200 text-sm">Guru Madura</p>
                            </div>

                            {/* Login Header with Traditional Border */}
                            <div className="text-center mb-8 relative">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">Harus Masok</h2>
                                <p className="text-yellow-200 text-sm sm:text-base">Sistem Pangajaran E-NGAJER</p>
                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-xl">
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-yellow-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm font-medium text-white">{status}</p>
                                    </div>
                                </div>
                            )}

                            {/* Login Form */}
                            <div className="space-y-5">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-yellow-100 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        Jeneng Pengguna
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-yellow-600/40 rounded-xl text-white placeholder-yellow-200/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-lg"
                                            placeholder="Ketik jeneng pengguna"
                                            autoComplete="username"
                                            autoFocus
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    {errors.email && <p className="mt-2 text-sm text-yellow-200">{errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-yellow-100 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Kata Sandi
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !processing) {
                                                    submit(e);
                                                }
                                            }}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-yellow-600/40 rounded-xl text-white placeholder-yellow-200/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-lg"
                                            placeholder="Ketik kata sandi"
                                            autoComplete="current-password"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    {errors.password && <p className="mt-2 text-sm text-yellow-200">{errors.password}</p>}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="rounded border-2 border-yellow-400/50 bg-white/10 text-yellow-500 focus:ring-yellow-400 focus:ring-offset-0 w-4 h-4"
                                        />
                                        <span className="ml-2 text-sm text-yellow-100 group-hover:text-white transition-colors">
                                            sempen kabbi
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-yellow-200 hover:text-white transition-colors font-medium"
                                        >
                                            Loppa ka Sandinah ?
                                        </Link>
                                    )}
                                </div>

                                {/* Login Button with Traditional Style */}
                                <div className="pt-4">
                                    <button
                                        onClick={submit}
                                        disabled={processing}
                                        className="w-full group relative overflow-hidden py-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 text-red-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                                        {processing ? (
                                            <span className="flex items-center justify-center relative z-10">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Nyoba Masok...
                                            </span>
                                        ) : (
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                Masok ka Dashboard
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Footer Links */}
                            <div className="mt-8 pt-6 border-t-2 border-yellow-600/30">
                                <div className="text-center space-y-3">
                                    <a href="#" className="inline-block text-sm text-yellow-200 hover:text-white transition-colors font-medium">
                                        Syarat & Ketentuan
                                    </a>
                                    <div className="text-center">
                                        <p className="text-xs text-yellow-100 mb-1">
                                            Badha masalah?{' '}
                                            <a href="#" className="text-white hover:underline font-semibold">
                                                Hubungi kabbi
                                            </a>
                                        </p>
                                        <a href="mailto:ppsabar150@gmail.com" className="inline-flex items-center gap-1 text-xs text-white hover:underline bg-white/10 px-3 py-1 rounded-full">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            ppsabar150@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
