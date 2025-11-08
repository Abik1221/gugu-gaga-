
"use client";
import React, { useState, FormEvent } from "react";

type Errors = {
    identifier?: string;
    password?: string;
    form?: string;
};

export default function PharmacySignInPage(): JSX.Element {
    const [identifier, setIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [remember, setRemember] = useState<boolean>(true);
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);

    function validate(): Errors {
        const e: Errors = {};
        if (!identifier.trim()) e.identifier = "Email or phone is required";
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier) && !/^\+?[0-9]{7,15}$/.test(identifier)) {
            e.identifier = "Enter a valid email or phone number";
        }
        if (!password) e.password = "Password is required";
        else if (password.length < 6) e.password = "Password must be 6+ characters";
        return e;
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            console.log("SIGN IN", { identifier, password, remember });
        } catch (err) {
            setErrors({ form: "Failed to sign in. Check credentials and try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white text-slate-800 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl shadow-2xl overflow-hidden bg-white border border-slate-200">
                {/* Left: brand area */}
                <aside className="hidden md:flex flex-col justify-center items-start p-10 bg-gradient-to-br from-emerald-100 to-emerald-50">
                    <div className="rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white font-bold">Rx</div>
                            <div>
                                <h2 className="text-2xl font-semibold text-emerald-700">GreenLeaf Pharmacy</h2>
                                <p className="text-sm text-slate-500">Fast — Reliable — Caring</p>
                            </div>
                        </div>

                        <p className="text-slate-600 leading-relaxed">Access inventory, manage prescriptions, and serve patients quickly. Sign in to continue to your pharmacy dashboard.</p>

                        <ul className="mt-6 space-y-2 text-sm text-slate-600">
                            <li>• Prescription management</li>
                            <li>• Stock & expiry alerts</li>
                            <li>• Secure patient records</li>
                        </ul>
                    </div>
                </aside>

                {/* Right: sign-in form */}
                <main className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Sign in to your pharmacy</h1>
                        <p className="text-sm text-slate-500 mt-1">Welcome back — enter your credentials to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.form && (
                            <div className="text-sm text-red-600 bg-red-100 border border-red-300 p-3 rounded">{errors.form}</div>
                        )}

                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 mb-2">Email or phone</label>
                            <input
                                id="identifier"
                                name="identifier"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className={`w-full bg-white border ${errors.identifier ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                                placeholder="you@pharmacy.com or +251900000000"
                                aria-invalid={!!errors.identifier}
                                aria-describedby={errors.identifier ? 'identifier-error' : undefined}
                                autoComplete="username"
                                inputMode="email"
                            />
                            {errors.identifier && <p id="identifier-error" className="mt-2 text-sm text-red-600">{errors.identifier}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-lg px-4 py-3 pr-12 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                                    placeholder="••••••••"
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-emerald-600 bg-emerald-100 px-3 py-1 rounded-md"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <p id="password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400" />
                                <span className="text-slate-600">Remember me</span>
                            </label>

                            <a href="/forgot-password" className="text-sm text-emerald-600 hover:underline">Forgot password?</a>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-xl px-4 py-3 font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>

                        <div className="text-center text-sm text-slate-500">
                            Don't have an account? <a href="/register/pharmacy" className="text-emerald-600 hover:underline">Create one</a>
                        </div>
                    </form>

                    <div className="mt-6 text-xs text-slate-400">
                        <p>By signing in you agree to our <a href="/terms" className="text-emerald-600 hover:underline">Terms</a> and <a href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</a>.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}