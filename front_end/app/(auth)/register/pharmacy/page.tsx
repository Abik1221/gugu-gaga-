"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, UploadAPI } from "@/utils/api";
import { SimpleLoading } from "@/components/ui/simple-loading";

type FieldKey =
  | "pharmacyName"
  | "ownerEmail"
  | "ownerPassword"
  | "idNumber"
  | "licenseNumber"
  | "kycFile"
  | "ownerPhone";

const createEmptyFieldErrors = (): Record<FieldKey, string | null> => ({
  pharmacyName: null,
  ownerEmail: null,
  ownerPassword: null,
  idNumber: null,
  licenseNumber: null,
  kycFile: null,
  ownerPhone: null,
});

function PharmacyRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const affiliateToken = searchParams.get("token") || searchParams.get("ref") || undefined;
  const { show } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<FieldKey, string | null>>(() => createEmptyFieldErrors());

  const [pharmacyName, setPharmacyName] = useState("");
  const [address, setAddress] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [kycNotes, setKycNotes] = useState("");
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [kycUploadPath, setKycUploadPath] = useState<string | null>(null);

  const clearFieldError = (key: FieldKey) =>
    setFieldErrors((prev) => ({
      ...prev,
      [key]: null,
    }));

  async function submitPharmacy(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors(createEmptyFieldErrors());

    const trimmedPharmacyName = pharmacyName.trim();
    const trimmedOwnerEmail = ownerEmail.trim();
    const trimmedOwnerPhone = ownerPhone.trim();
    const trimmedId = idNumber.trim();
    const trimmedLicense = licenseNumber.trim();

    const validationErrors: Partial<Record<FieldKey, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if (!trimmedPharmacyName) {
      validationErrors.pharmacyName = "Enter the registered pharmacy name.";
    }
    if (!trimmedOwnerEmail || !emailRegex.test(trimmedOwnerEmail)) {
      validationErrors.ownerEmail = "Enter a valid email like owner@pharmacy.com.";
    }
    if (!ownerPassword || ownerPassword.length < 6) {
      validationErrors.ownerPassword = "Password must be at least 6 characters.";
    }
    if (!trimmedId) {
      validationErrors.idNumber = "Provide a government or company ID number.";
    }
    if (!trimmedLicense) {
      validationErrors.licenseNumber = "Include the official pharmacy license number.";
    }
    if (!kycFile) {
      validationErrors.kycFile = "Attach a JPG or PNG scan of the license.";
    } else if (!/(image\/jpeg|image\/png)/.test(kycFile.type)) {
      validationErrors.kycFile = "Accepted formats: JPG or PNG.";
    }
    if (trimmedOwnerPhone && !phoneRegex.test(trimmedOwnerPhone)) {
      validationErrors.ownerPhone = "Use international format e.g. +2519XXXXXXX.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(() => {
        const next = createEmptyFieldErrors();
        (Object.keys(validationErrors) as FieldKey[]).forEach((key) => {
          next[key] = validationErrors[key] ?? null;
        });
        return next;
      });
      setError("Please correct the highlighted fields.");
      show({ variant: "destructive", title: "Missing information", description: "Fix the highlighted inputs and try again." });
      return;
    }

    setLoading(true);
    try {
      let docPath: string | undefined = undefined;
      if (kycFile) {
        const upload = await UploadAPI.uploadKyc(kycFile);
        docPath = upload.path;
        setKycUploadPath(upload.path);
      }

      const registerRes = await AuthAPI.registerPharmacy({
        pharmacy_name: trimmedPharmacyName,
        address: address.trim() || undefined,
        owner_email: trimmedOwnerEmail,
        owner_phone: trimmedOwnerPhone || undefined,
        owner_password: ownerPassword,
        id_number: trimmedId,
        pharmacy_license_number: trimmedLicense,
        kyc_notes: kycNotes.trim() || undefined,
        pharmacy_license_document_path: docPath,
        affiliate_token: affiliateToken,
      });

      const auth = await AuthAPI.login(trimmedOwnerEmail, ownerPassword, registerRes?.tenant_id);
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", auth.access_token);
        if (auth.refresh_token) localStorage.setItem("refresh_token", auth.refresh_token);
        if (registerRes?.tenant_id) localStorage.setItem("tenant_id", registerRes.tenant_id);
      }
      const me = await AuthAPI.me();
      if (typeof window !== "undefined" && me?.tenant_id) {
        localStorage.setItem("tenant_id", me.tenant_id);
      }

      setSuccess("Application received. Redirecting to your dashboard...");
      show({
        variant: "success",
        title: "Submitted",
        description: "Your dashboard will update once KYC is approved.",
      });
      setTimeout(() => router.replace("/dashboard/owner"), 600);
    } catch (err: any) {
      const message = err?.message || "Failed to submit";
      setError(message);
      show({ variant: "destructive", title: "Failed", description: message });
    } finally {
      setLoading(false);
    }
  }

  const featureBullets = [
    "Multi-branch performance tracking",
    "Real-time inventory insights",
    "AI-powered demand forecasting",
    "Seamless POS integration",
  ];

  return (
    <div className="relative flex min-h-screen text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-white  p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 blur opacity-70" />
              <div className="relative rounded-xl  p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6 text-white"
                >
                  <path d="M12 3c2.755 0 5 2.175 5 4.857 0 2.143-1.444 3.824-3.556 5.467-1.11.884-.799 2.676-.799 4.43h-1.29c0-1.754.311-3.546-.8-4.43C8.444 11.68 7 9.999 7 7.857 7 5.175 9.245 3 12 3z" />
                  <path d="M6.343 17.657a8 8 0 0 1 11.314 0L12 23l-5.657-5.343z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-semibold tracking-wide text-white/90">
              Zemen Pharma
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-tight text-black">
            Build a future-ready pharmacy
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Join a network of modern pharmacies using AI-driven workflows to automate operations and deliver
            world-class patient experiences.
          </p>

          <ul className="mt-10 space-y-4 text-slate-700">
            {featureBullets.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-black" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-4 text-sm text-slate-700"
        >
          <p>
            “The onboarding experience with Zemen Pharma is seamless. Their KYC process and centralized dashboards
            transformed how we run our branches.”
          </p>
          <div className="h-px w-24 bg-white/20" />
          <p>
            Need help? <Link href="/contact" className="text-black hover:underline">Contact our onboarding team</Link>
          </p>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[560px] lg:px-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-[0_25px_80px_-40px_rgba(16,185,129,0.65)] backdrop-blur"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-black">Register your pharmacy</h2>
            <p className="mt-2 text-sm text-slate-600">
              Start with a full-featured trial. No credit card required.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {success}
            </div>
          )}

          <form onSubmit={submitPharmacy} className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Pharmacy name*
                </label>
                <Input
                  value={pharmacyName}
                  onChange={(e) => {
                    clearFieldError("pharmacyName");
                    setPharmacyName(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:ring-2 ${fieldErrors.pharmacyName
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Use the exact legal name that appears on your pharmacy license.</p>
                {fieldErrors.pharmacyName ? (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.pharmacyName}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 border border-slate-200 bg-white/5 text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:border-emerald-400 focus-visible:ring-emerald-400/40"
                />
                <p className="mt-1 text-xs text-slate-500">Optional — headquarters or primary operating address.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Owner email*
                </label>
                <Input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => {
                    clearFieldError("ownerEmail");
                    setOwnerEmail(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:ring-2 ${fieldErrors.ownerEmail
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">We’ll send onboarding updates here (example: owner@pharmacy.com).</p>
                {fieldErrors.ownerEmail ? (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.ownerEmail}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Owner phone
                </label>
                <Input
                  value={ownerPhone}
                  onChange={(e) => {
                    clearFieldError("ownerPhone");
                    setOwnerPhone(e.target.value);
                  }}
                  placeholder="+2519..."
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:ring-2 ${fieldErrors.ownerPhone
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Optional — include an international format number so we can reach you quickly.</p>
                {fieldErrors.ownerPhone ? (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.ownerPhone}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Password*
                </label>
                <Input
                  type="password"
                  value={ownerPassword}
                  onChange={(e) => {
                    clearFieldError("ownerPassword");
                    setOwnerPassword(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:ring-2 ${fieldErrors.ownerPassword
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Minimum 6 characters. Use a mix of letters and numbers for security.</p>
                {fieldErrors.ownerPassword ? (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.ownerPassword}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  National / company ID*
                </label>
                <Input
                  value={idNumber}
                  onChange={(e) => {
                    clearFieldError("idNumber");
                    setIdNumber(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:ring-2 ${fieldErrors.idNumber
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Provide the government-issued or commercial registration ID.</p>
                {fieldErrors.idNumber ? (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.idNumber}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Pharmacy license number*
                </label>
                <Input
                  value={licenseNumber}
                  onChange={(e) => {
                    clearFieldError("licenseNumber");
                    setLicenseNumber(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:ring-2 ${fieldErrors.licenseNumber
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Enter the regulator-issued permit number exactly as shown.</p>
                {fieldErrors.licenseNumber ? (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.licenseNumber}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  License document (jpg/png)*
                </label>
                <label
                  className={`mt-2 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed px-4 py-3 text-sm transition ${fieldErrors.kycFile
                    ? "border-red-400/60 bg-red-500/10 text-red-100 hover:border-red-300/70 hover:bg-red-500/15"
                    : "border-emerald-300 bg-white/5 text-emerald-100/70 hover:border-emerald-300/60 hover:bg-white/10"
                    }`}
                >
                  <span className="text-slate-500">{kycFile ? kycFile.name : "Upload document"}</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                      clearFieldError("kycFile");
                      setKycFile(e.target.files?.[0] || null);
                    }}
                    className="hidden"
                  />
                  <span className="text-xs uppercase tracking-wide text-emerald-400">Browse</span>
                </label>
                <p className="mt-1 text-xs text-slate-500">Upload a clear scan or photo of the valid pharmacy license (JPG or PNG).</p>
                {fieldErrors.kycFile ? (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.kycFile}</p>
                ) : null}
                {kycUploadPath && (
                  <p className="mt-1 text-xs text-emerald-200/60">Uploaded: {kycUploadPath}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Notes to reviewer
                </label>
                <textarea
                  rows={3}
                  value={kycNotes}
                  onChange={(e) => setKycNotes(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/5 px-3 py-2 text-sm text-slate-700 placeholder:text-emerald-100/40 transition focus-visible:border-emerald-400 focus-visible:ring-emerald-400/40"
                />
                <p className="mt-1 text-xs text-slate-500">Optional context for the reviewers (operating hours, special approvals, etc.).</p>
              </div>
            </div>

            {affiliateToken && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-100/80">
                Referral token detected. Affiliate rewards will apply after approval.
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-black hover:bg-slate-800 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-emerald-400/40"
            >
              {loading ? (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              {loading ? "Submitting..." : "Submit application"}
            </Button>

            <p className="text-center text-xs text-slate-700">
              Already have an owner account?{" "}
              <Link href="/pharmacy-signin" className="font-medium text-emerald-400 hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-[11px] text-slate-700">
            By continuing you agree to our {" "}
            <Link href="/terms" className="text-emerald-400 hover:underline">
              Terms
            </Link>{" "}
            and {" "}
            <Link href="/privacy" className="text-emerald-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function PharmacyRegisterPage() {
  return (
    <Suspense fallback={<SimpleLoading />}>
      <PharmacyRegisterContent />
    </Suspense>
  );
}
