"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  const [tab, setTab] = useState<Tab>("pharmacy");
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
    setError(null); setSuccess(null); setLoading(true);
    try {
      if (!pharmacyName.trim()) throw new Error("Pharmacy name is required");
      if (!ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) throw new Error("Valid owner email required");
      if (!ownerPassword || ownerPassword.length < 6) throw new Error("Password must be at least 6 characters");
      if (!idNumber.trim() || !licenseNumber.trim()) throw new Error("ID number and license number are required");
      // Upload KYC document if provided
      let docPath: string | undefined = undefined;
      if (kycFile) {
        const up = await UploadAPI.uploadKyc(kycFile);
        docPath = up.path;
        setKycUploadPath(up.path);
      }
      await AuthAPI.registerPharmacy({
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
      setSuccess("Application received. Await admin approval.");
      show({ variant: "success", title: "Submitted", description: "KYC review pending" });
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to submit");
      show({ variant: "destructive", title: "Failed", description: err.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  }

  async function submitAffiliate(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      if (!affEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(affEmail)) throw new Error("Valid email required");
      if (!affPassword || affPassword.length < 6) throw new Error("Password must be at least 6 characters");
      await AuthAPI.registerAffiliate({
        email: affEmail,
        password: affPassword,
        affiliate_full_name: fullName || undefined,
        bank_name: bankName || undefined,
        bank_account_name: bankAccountName || undefined,
        bank_account_number: bankAccountNumber || undefined,
        iban: iban || undefined,
      });
      setSuccess("Affiliate registered. Please verify your email.");
      show({ variant: "success", title: "Registered", description: "Check your email for verification code" });
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      show({ variant: "destructive", title: "Failed", description: err.message || "Please try again" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <div className="flex gap-2">
          <Button variant={tab === "pharmacy" ? "default" : "outline"} onClick={() => setTab("pharmacy")}>Pharmacy</Button>
          <Button variant={tab === "affiliate" ? "default" : "outline"} onClick={() => setTab("affiliate")}>Affiliate</Button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 text-sm">{success}</p>}

        {tab === "pharmacy" ? (
          <form onSubmit={submitPharmacy} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm">Pharmacy Name</label>
                <Input value={pharmacyName} onChange={(e)=>setPharmacyName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Address</label>
                <Input value={address} onChange={(e)=>setAddress(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Owner Email</label>
                <Input type="email" value={ownerEmail} onChange={(e)=>setOwnerEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Owner Phone</label>
                <Input value={ownerPhone} onChange={(e)=>setOwnerPhone(e.target.value)} placeholder="+2519..." />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Password</label>
                <Input type="password" value={ownerPassword} onChange={(e)=>setOwnerPassword(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm">National/Company ID</label>
                <Input value={idNumber} onChange={(e)=>setIdNumber(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Pharmacy License Number</label>
                <Input value={licenseNumber} onChange={(e)=>setLicenseNumber(e.target.value)} required />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm">Notes to Reviewer</label>
                <textarea className="w-full border rounded px-3 py-2" rows={3} value={kycNotes} onChange={(e)=>setKycNotes(e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm">KYC Document (PDF/JPG/PNG, max 10MB)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e)=>setKycFile(e.target.files?.[0] || null)} />
                {kycUploadPath && (<div className="text-xs text-gray-500">Uploaded: {kycUploadPath}</div>)}
              </div>
            </div>
            {affiliateToken && (
              <div className="text-xs text-gray-600">Referral token detected.</div>
            )}
            <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Application"}</Button>
          </form>
        ) : (
          <form onSubmit={submitAffiliate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm">Email</label>
                <Input type="email" value={affEmail} onChange={(e)=>setAffEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Password</label>
                <Input type="password" value={affPassword} onChange={(e)=>setAffPassword(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Full Name (for payouts)</label>
                <Input value={fullName} onChange={(e)=>setFullName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Bank Name</label>
                <Input value={bankName} onChange={(e)=>setBankName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Bank Account Name</label>
                <Input value={bankAccountName} onChange={(e)=>setBankAccountName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Bank Account Number</label>
                <Input value={bankAccountNumber} onChange={(e)=>setBankAccountNumber(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm">IBAN (optional)</label>
                <Input value={iban} onChange={(e)=>setIban(e.target.value)} />
              </div>
            </div>
            <Button type="submit" disabled={loading}>{loading ? "Registering..." : "Register as Affiliate"}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
