"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postMultipart } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import Footer from "@/components/sections/Footer";
import NavBar from "@/components/layout/NavBar";

export default function RegisterPage() {
    const router = useRouter();
    const { show } = useToast();
    const [tenantName, setTenantName] = useState("");
    const [tenantSlug, setTenantSlug] = useState("");
    const [tenantDescription, setTenantDescription] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [kycFullName, setKycFullName] = useState("");
    const [kycEmail, setKycEmail] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [licenseFile, setLicenseFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        try {
            const url = new URL(window.location.href);
            const ref = url.searchParams.get("ref");
            if (ref) localStorage.setItem("referral_code", ref);
        } catch { }
    }, []);

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] || null;
        if (f) {
            const okType = ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(f.type);
            const okSize = f.size <= 10 * 1024 * 1024;
            if (!okType) {
                setError("Invalid file type. Only PDF, JPG, JPEG, PNG allowed");
                setLicenseFile(null);
                return;
            }
            if (!okSize) {
                setError("File too large. Maximum size is 10MB");
                setLicenseFile(null);
                return;
            }
            setError(null);
            setLicenseFile(f);
        } else {
            setLicenseFile(null);
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const errs: Record<string, string> = {};
        if (!tenantName.trim()) errs.tenantName = "Tenant name is required";
        if (!tenantSlug.trim() || !/^[a-z0-9-]{3,}$/.test(tenantSlug))
            errs.tenantSlug = "Slug must be 3+ chars, lowercase, digits or hyphen";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
        if (!username.trim() || username.trim().length < 3) errs.username = "Username must be at least 3 characters";
        if (!firstName.trim()) errs.firstName = "First name is required";
        if (!lastName.trim()) errs.lastName = "Last name is required";
        if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 7)
            errs.phoneNumber = "Enter a valid phone number";
        if (!password || password.length < 8) errs.password = "Password must be at least 8 characters";
        if (!kycFullName.trim()) errs.kycFullName = "KYC full name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kycEmail)) errs.kycEmail = "Enter a valid KYC email";
        if (!nationalId.trim() || nationalId.trim().length < 5) errs.nationalId = "Enter a valid National ID";
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;
        if (!licenseFile) {
            setError("Pharmacy license file is required");
            return;
        }
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("tenant_name", tenantName);
            fd.append("tenant_slug", tenantSlug);
            fd.append("tenant_description", tenantDescription);
            fd.append("email", email);
            fd.append("username", username);
            fd.append("first_name", firstName);
            fd.append("last_name", lastName);
            fd.append("phone_number", phoneNumber);
            fd.append("password", password);
            fd.append("kyc_full_name", kycFullName);
            fd.append("kyc_email", kycEmail);
            fd.append("national_id", nationalId);
            fd.append("license_file", licenseFile);

            await postMultipart("/api/v1/auth/register", fd);
            setSuccess("Registration submitted. KYC status pending. Redirecting to login...");
            show({ variant: "success", title: "Registration submitted", description: "KYC review is pending" });
            setTimeout(() => router.replace("/login"), 1200);
        } catch (err: any) {
            setError(err.message || "Registration failed");
            show({
                variant: "destructive",
                title: "Registration failed",
                description: err.message || "Please try again",
            });
        } finally {
            setLoading(false);
        }
    }
    // ------------------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        document.documentElement.style.scrollBehavior = "smooth";
        return () => {
            document.documentElement.style.scrollBehavior = "";
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            setIsOpen(false);
        }
    };
    return (
        <div className="flex flex-col bg-emerald-50">
            <NavBar
                isOpen={isOpen}
                scrolled={scrolled}
                setIsOpen={setIsOpen}
                setScrolled={setScrolled}
                handleScrollToSection={handleScrollToSection}
            />
            <div className="mx-auto w-full sm:w-[820px] my-10 mt-30">
                <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100 px-6 py-5">
                        <h1 className="text-xl font-semibold text-emerald-800">
                            Create your Zemen Pharma account
                        </h1>
                        <p className="text-sm text-emerald-700/80 mt-1">
                            Tell us about your pharmacy and owner details to get started.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="p-6 space-y-8">
                        {/* Tenant */}
                        <section>
                            <h2 className="text-sm font-semibold text-emerald-800">Pharmacy Details</h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">Tenant Name</label>
                                    <Input
                                        value={tenantName}
                                        onChange={(e) => setTenantName(e.target.value)}
                                        required
                                        aria-invalid={!!fieldErrors.tenantName}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.tenantName && (
                                        <div className="text-xs text-red-600">{fieldErrors.tenantName}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">Tenant Slug</label>
                                    <Input
                                        value={tenantSlug}
                                        onChange={(e) => setTenantSlug(e.target.value)}
                                        required
                                        aria-invalid={!!fieldErrors.tenantSlug}
                                        placeholder="e.g. zemen-pharma"
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    <div className="text-xs text-emerald-700/70">
                                        Lowercase letters, numbers, and hyphens
                                    </div>
                                    {fieldErrors.tenantSlug && (
                                        <div className="text-xs text-red-600">{fieldErrors.tenantSlug}</div>
                                    )}
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm text-emerald-700">Tenant Description</label>
                                    <textarea
                                        className="w-full border rounded px-3 py-2 border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                                        rows={3}
                                        value={tenantDescription}
                                        onChange={(e) => setTenantDescription(e.target.value)}
                                        placeholder="Briefly describe your pharmacy"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Owner */}
                        <section>
                            <h2 className="text-sm font-semibold text-emerald-800">Owner Details</h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">Email</label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        aria-invalid={!!fieldErrors.email}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.email && (
                                        <div className="text-xs text-red-600">{fieldErrors.email}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">Username</label>
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoComplete="username"
                                        aria-invalid={!!fieldErrors.username}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.username && (
                                        <div className="text-xs text-red-600">{fieldErrors.username}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">First Name</label>
                                    <Input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        aria-invalid={!!fieldErrors.firstName}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.firstName && (
                                        <div className="text-xs text-red-600">{fieldErrors.firstName}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">Last Name</label>
                                    <Input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        aria-invalid={!!fieldErrors.lastName}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.lastName && (
                                        <div className="text-xs text-red-600">{fieldErrors.lastName}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">Phone Number</label>
                                    <Input
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        autoComplete="tel"
                                        aria-invalid={!!fieldErrors.phoneNumber}
                                        placeholder="e.g. +2519..."
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.phoneNumber && (
                                        <div className="text-xs text-red-600">{fieldErrors.phoneNumber}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">Password</label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        aria-invalid={!!fieldErrors.password}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    <div className="text-xs text-emerald-700/70">Minimum 8 characters</div>
                                    {fieldErrors.password && (
                                        <div className="text-xs text-red-600">{fieldErrors.password}</div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* KYC */}
                        <section>
                            <h2 className="text-sm font-semibold text-emerald-800">KYC Details</h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">KYC Full Name</label>
                                    <Input
                                        value={kycFullName}
                                        onChange={(e) => setKycFullName(e.target.value)}
                                        required
                                        aria-invalid={!!fieldErrors.kycFullName}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.kycFullName && (
                                        <div className="text-xs text-red-600">{fieldErrors.kycFullName}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">KYC Email</label>
                                    <Input
                                        type="email"
                                        value={kycEmail}
                                        onChange={(e) => setKycEmail(e.target.value)}
                                        required
                                        aria-invalid={!!fieldErrors.kycEmail}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.kycEmail && (
                                        <div className="text-xs text-red-600">{fieldErrors.kycEmail}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">National ID</label>
                                    <Input
                                        value={nationalId}
                                        onChange={(e) => setNationalId(e.target.value)}
                                        required
                                        aria-invalid={!!fieldErrors.nationalId}
                                        className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                                    />
                                    {fieldErrors.nationalId && (
                                        <div className="text-xs text-red-600">{fieldErrors.nationalId}</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-emerald-700">
                                        Pharmacy License (PDF/JPG/PNG, max 10MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={onFileChange}
                                        required
                                        className="block w-full text-emerald-900 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-white hover:file:bg-emerald-700"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between gap-4 pt-2">
                            <p className="text-xs text-emerald-700/70">
                                By continuing you agree to our{" "}
                                <a className="underline text-emerald-700" href="/terms">
                                    Terms
                                </a>{" "}
                                and{" "}
                                <a className="underline text-emerald-700" href="/privacy">
                                    Privacy Policy
                                </a>
                                .
                            </p>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="min-w-44 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {loading ? "Submitting..." : "Create Account"}
                            </Button>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {success && <p className="text-sm text-emerald-700">{success}</p>}
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}