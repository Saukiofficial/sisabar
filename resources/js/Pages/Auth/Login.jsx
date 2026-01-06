import { useState } from 'react';

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = () => {
        setProcessing(true);
        // Simulate login process
        setTimeout(() => {
            setProcessing(false);
            alert('Login functionality would be handled by Inertia.js');
        }, 1000);
    };

    return (
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
                            <div className="bg-white p-2 rounded-xl shadow-lg">
                                <img
                                    src="/images/icons/logosisabar.png"
                                    alt="SI SABAR Logo"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-teal-800">SI SABAR</h1>
                                <p className="text-xs text-teal-600">Sistem Informasi Santri Belajar</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Illustration */}
                    <div className="relative w-full max-w-md">
                        {/* Decorative Background Shape */}
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-100/40 to-emerald-100/40 rounded-full blur-3xl transform -rotate-6"></div>

                        {/* Image Container */}
                        <div className="relative z-10">
                            <img
                                src="/images/santri.png"
                                alt="Ilustrasi Santri"
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-teal-400/20 rounded-full"></div>
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-400/20 rounded-full"></div>
                    </div>

                    {/* Bottom Text */}
                    <div className="absolute bottom-8 left-8 right-8 text-center">
                        <p className="text-sm text-teal-700">
                            © 2026 SI SABAR. All rights reserved.
                        </p>
                        <p className="text-xs text-teal-600 mt-1">Powered by kyysolutions</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex items-center justify-center p-8 sm:p-12 bg-gradient-to-br from-emerald-700 via-teal-600 to-teal-700">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="bg-white p-3 rounded-2xl shadow-xl">
                                <img
                                    src="/images/icons/logosisabar.png"
                                    alt="SI SABAR Logo"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                        </div>

                        {/* Login Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
                            <p className="text-teal-100">Masuk ke sistem informasi santri</p>
                        </div>

                        {/* Login Form */}
                        <div className="space-y-5">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                    Username
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    value={data.email}
                                    onChange={(e) => setData({...data, email: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                    placeholder="Enter your username"
                                    autoFocus
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-200">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData({...data, password: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !processing) {
                                            handleSubmit();
                                        }
                                    }}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-200">{errors.password}</p>
                                )}
                            </div>

                            {/* Forgot Password Link
                            <div className="text-right">
                                <a href="#" className="text-sm text-teal-100 hover:text-white transition-colors">
                                    Forgot Password?
                                </a>
                            </div> */}

                            {/* Login Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full py-3.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-emerald-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
                                    'Login to system'
                                )}
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex justify-center gap-6 text-sm text-teal-100">
                                <a href="#" className="hover:text-white transition-colors">
                                    Terms and Services
                                </a>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs text-teal-200">
                                    Have a problem?{' '}
                                    <a href="#" className="text-white hover:underline">
                                        Contact us at
                                    </a>
                                </p>
                                <a href="mailto:info@unusa.ac.id" className="text-xs text-white hover:underline">
                                    kyysolutions17@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
