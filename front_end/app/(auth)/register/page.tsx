"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI, UploadAPI } from "@/utils/api";

type Tab = "pharmacy" | "affiliate";

export default function RegisterPage() {
  const router = useRouter();
  const qp = useSearchParams();
  const { show } = useToast();
  const tabParam = qp.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(
    tabParam === "affiliate" ? "affiliate" : "pharmacy"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const affiliateToken = qp.get("token") || qp.get("ref") || undefined;

  // Pharmacy form
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

  // Affiliate form
  const [affEmail, setAffEmail] = useState("");
  const [affPassword, setAffPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [iban, setIban] = useState("");

  const fieldErrors = useMemo(() => ({} as Record<string, string>), []);

  async function submitPharmacy(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!pharmacyName.trim()) throw new Error("Pharmacy name is required");
      if (!ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail))
        throw new Error("Valid owner email required");
      if (!ownerPassword || ownerPassword.length < 6)
        throw new Error("Password must be at least 6 characters");
      if (!idNumber.trim() || !licenseNumber.trim())
        throw new Error("ID number and license number are required");
      let docPath: string | undefined = undefined;
      if (kycFile) {
        const up = await UploadAPI.uploadKyc(kycFile);
        docPath = up.path;
        setKycUploadPath(up.path);
      }
      const registerRes = await AuthAPI.registerPharmacy({
        pharmacy_name: pharmacyName,
        address: address || undefined,
        owner_email: ownerEmail,
        owner_phone: ownerPhone || undefined,
        owner_password: ownerPassword,
        id_number: idNumber,
        pharmacy_license_number: licenseNumber,
        kyc_notes: kycNotes || undefined,
        pharmacy_license_document_path: docPath,
        affiliate_token: affiliateToken,
      });
      const auth = await AuthAPI.login(
        ownerEmail,
        ownerPassword,
        registerRes?.tenant_id
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", auth.access_token);
        if (auth.refresh_token)
          localStorage.setItem("refresh_token", auth.refresh_token);
        if (registerRes?.tenant_id)
          localStorage.setItem("tenant_id", registerRes.tenant_id);
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
      setError(err.message || "Failed to submit");
      show({
        variant: "destructive",
        title: "Failed",
        description: err.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  async function submitAffiliate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!affEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(affEmail))
        throw new Error("Valid email required");
      if (!affPassword || affPassword.length < 6)
        throw new Error("Password must be at least 6 characters");
      await AuthAPI.registerAffiliate({
        email: affEmail,
        password: affPassword,
        affiliate_full_name: fullName || undefined,
        bank_name: bankName || undefined,
        bank_account_name: bankAccountName || undefined,
        bank_account_number: bankAccountNumber || undefined,
      });
      setSuccess("Affiliate registered. Please verify your email.");
      show({
        variant: "success",
        title: "Registered",
        description: "Check your email for verification code",
      });
      setTimeout(
        () => router.replace(`/verify?email=${encodeURIComponent(affEmail)}`),
        1200
      );
    } catch (err: any) {
      const message = err?.message || "Registration failed";
      setError(message);
      show({ variant: "destructive", title: "Failed", description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 mt-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Zemen Pharma</h1>
          <p className="text-sm text-gray-500 mt-2">Create your account</p>
        </div>

        <div className="mb-6">
          {!tabParam && (
            <div className="flex justify-center gap-2">
              <button
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition ${
                  tab === "pharmacy"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                onClick={() => setTab("pharmacy")}
              >
                Pharmacy
              </button>
              <button
                className={`cursor-pointerpx-4 py-2 rounded-full text-sm font-medium transition ${
                  tab === "affiliate"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                onClick={() => setTab("affiliate")}
              >
                Affiliate
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {tab === "pharmacy" ? (
          <form onSubmit={submitPharmacy} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pharmacy Name
                </label>
                <Input
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Owner Email
                </label>
                <Input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Owner Phone
                </label>
                <Input
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+2519..."
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  National/Company ID
                </label>
                <Input
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pharmacy License Number
                </label>
                <Input
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pharmacy License Document (Image, required)
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-gray-200">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setKycFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m0 0h8"
                      />
                    </svg>
                    <span>{kycFile ? kycFile.name : "Choose file"}</span>
                  </label>
                  {kycUploadPath && (
                    <div className="text-xs text-gray-500">
                      Uploaded: {kycUploadPath}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes to Reviewer
                </label>
                <textarea
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  value={kycNotes}
                  onChange={(e) => setKycNotes(e.target.value)}
                />
              </div>
            </div>

            {affiliateToken && (
              <div className="text-xs text-gray-500">
                Referral token detected.
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
            <div className="text-center">
              Already have an account?{" "}
              <Link
                href="/auth?tab=signin"
                className="text-sm text-gray-600 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={submitAffiliate} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={affEmail}
                  onChange={(e) => setAffEmail(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  value={affPassword}
                  onChange={(e) => setAffPassword(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name (for payouts)
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bank Name
                </label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bank Account Name
                </label>
                <Input
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald- regolare border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bank Account Number
                </label>
                <Input
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="mt-1 border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "Registering..." : "Register as Affiliate"}
              </Button>
            </div>
            <div className="text-center">
              <Link
                href="/affiliate-login"
                className="text-sm text-gray-600 hover:underline"
              >
                Already have an affiliate account? Sign in
              </Link>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          By creating an account you agree to our{" "}
          <a href="/terms" className="underline hover:text-emerald-600">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-emerald-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
