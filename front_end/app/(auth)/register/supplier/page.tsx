"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI } from "@/utils/api";
import AuthNavBar from "@/components/layout/AuthNavBar";
import { OtpSentDialog } from "@/components/ui/otp-sent-dialog";

type FieldKey =
  | "supplierName"
  | "email"
  | "password"
  | "nationalId"
  | "tinNumber"
  | "licenseImage";

const createEmptyFieldErrors = (): Record<FieldKey, string | null> => ({
  supplierName: null,
  email: null,
  password: null,
  nationalId: null,
  tinNumber: null,
  licenseImage: null,
});

export default function SupplierRegisterPage() {
  const router = useRouter();
  const { show } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<FieldKey, string | null>>(() => createEmptyFieldErrors());
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  const [supplierName, setSupplierName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const clearFieldError = (key: FieldKey) =>
    setFieldErrors((prev) => ({
      ...prev,
      [key]: null,
    }));

  async function submitSupplier(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors(createEmptyFieldErrors());

    const trimmedSupplierName = supplierName.trim();
    const trimmedEmail = email.trim();
    const trimmedNationalId = nationalId.trim();
    const trimmedTinNumber = tinNumber.trim();

    const validationErrors: Partial<Record<FieldKey, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedSupplierName) {
      validationErrors.supplierName = "Enter your registered supplier/company name.";
    }
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      validationErrors.email = "Enter a valid email like supplier@company.com.";
    }
    if (!password || password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }
    if (!trimmedNationalId) {
      validationErrors.nationalId = "Provide your national ID number.";
    }
    if (!trimmedTinNumber) {
      validationErrors.tinNumber = "Provide your TIN (Tax Identification Number).";
    }
    if (!licenseImage) {
      validationErrors.licenseImage = "Upload your supplier license image.";
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
      let licenseBase64 = "";
      if (licenseImage) {
        const reader = new FileReader();
        licenseBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(licenseImage);
        });
      }

      const data = await AuthAPI.registerSupplier({
        email: trimmedEmail,
        password: password,
        supplier_name: trimmedSupplierName,
        national_id: trimmedNationalId,
        tin_number: trimmedTinNumber,
        business_license_image: licenseBase64,
        phone: phone.trim() || null,
        address: address.trim() || null,
      });
      
      // Store tokens immediately after registration
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token", data.access_token); // Also store as 'token'
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      if (data.user?.role) {
        localStorage.setItem("user_role", data.user.role);
      }
      
      setRegisteredEmail(trimmedEmail);
      setOtpSent(true);
      setSuccess("Registration successful! Please verify your email.");
      setShowOtpDialog(true);
    } catch (err: any) {
      const message = err?.message || "Failed to register";
      setError(message);
      show({ variant: "destructive", title: "Registration Failed", description: message });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const verifyData = await AuthAPI.registerVerify(registeredEmail, otp);
      
      // Store tokens from verification response
      if (verifyData.access_token) {
        localStorage.setItem("access_token", verifyData.access_token);
        localStorage.setItem("token", verifyData.access_token); // Also store as 'token'
      }
      if (verifyData.refresh_token) {
        localStorage.setItem("refresh_token", verifyData.refresh_token);
      }
      if (verifyData.user?.role) {
        localStorage.setItem("user_role", verifyData.user.role);
      }
      
      setSuccess("Email verified! Redirecting to dashboard...");
      show({
        variant: "success",
        title: "Verification Complete",
        description: "Your account has been verified. Redirecting to dashboard.",
      });
      setTimeout(() => window.location.href = "/dashboard/supplier", 1500);
    } catch (err: any) {
      const message = err?.message || "Verification failed";
      setError(message);
      show({ variant: "destructive", title: "Verification Failed", description: message });
    } finally {
      setLoading(false);
    }
  }

  const featureBullets = [
    "Access to verified pharmacy network",
    "Real-time order management system",
    "Advanced analytics and reporting",
    "Secure payment processing",
  ];

  return (
    <>
      <AuthNavBar />
      <OtpSentDialog 
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={registeredEmail}
        purpose="register"
      />
      <div className="relative flex min-h-screen text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-80 w-80 rounded-full bg-green-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-white p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 blur opacity-70" />
              <div className="relative rounded-xl p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6 text-white"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-semibold tracking-wide text-white/90">
              Zemen Pharma
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-tight text-black">
            Join our supplier network
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Connect with verified pharmacies across the region and grow your pharmaceutical supply business with our advanced platform.
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
            "Mesob's business management platform has streamlined our operations and connected us with quality business partners nationwide."
          </p>
          <div className="h-px w-24 bg-white/20" />
          <p>
            Need help? <Link href="/contact" className="text-black hover:underline">Contact our supplier support team</Link>
          </p>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-4 py-16 sm:px-10 lg:w-[560px] lg:px-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-[0_25px_80px_-40px_rgba(34,197,94,0.65)] backdrop-blur"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-black">Register as Supplier</h2>
            <p className="mt-2 text-sm text-slate-600">
              Join our verified supplier network today.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-green-400/30 bg-green-500/10 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={otpSent ? handleVerifyOtp : submitSupplier} className="space-y-5">
            {otpSent ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Verification Code
                </label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="mt-2 border border-slate-200 bg-white/5 text-slate-700"
                  maxLength={6}
                />
                <p className="mt-1 text-xs text-slate-500">Check your email ({registeredEmail}) for the verification code.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Supplier/Company Name*
                </label>
                <Input
                  value={supplierName}
                  onChange={(e) => {
                    clearFieldError("supplierName");
                    setSupplierName(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:ring-2 ${fieldErrors.supplierName
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-green-400 focus-visible:ring-green-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Use your registered business name.</p>
                {fieldErrors.supplierName && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.supplierName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Email Address*
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    clearFieldError("email");
                    setEmail(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:ring-2 ${fieldErrors.email
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-green-400 focus-visible:ring-green-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Business email for account notifications.</p>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Password*
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    clearFieldError("password");
                    setPassword(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:ring-2 ${fieldErrors.password
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-green-400 focus-visible:ring-green-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Minimum 6 characters for security.</p>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  National ID Number*
                </label>
                <Input
                  value={nationalId}
                  onChange={(e) => {
                    clearFieldError("nationalId");
                    setNationalId(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:ring-2 ${fieldErrors.nationalId
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-green-400 focus-visible:ring-green-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Government-issued identification number.</p>
                {fieldErrors.nationalId && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.nationalId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  TIN Number*
                </label>
                <Input
                  value={tinNumber}
                  onChange={(e) => {
                    clearFieldError("tinNumber");
                    setTinNumber(e.target.value);
                  }}
                  className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:ring-2 ${fieldErrors.tinNumber
                    ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                    : "border-slate-200 focus-visible:border-green-400 focus-visible:ring-green-400/50"
                    }`}
                />
                <p className="mt-1 text-xs text-slate-500">Tax Identification Number for business verification.</p>
                {fieldErrors.tinNumber && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.tinNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Supplier License Image*
                </label>
                <div className="relative mt-2">
                  <input
                    type="file"
                    id="license-upload"
                    accept="image/*"
                    onChange={(e) => {
                      clearFieldError("licenseImage");
                      setLicenseImage(e.target.files?.[0] || null);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="license-upload"
                    className={`flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition bg-white/5 ${fieldErrors.licenseImage
                      ? "border-red-400/60 hover:border-red-300"
                      : "border-slate-200 hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {licenseImage && (
                        <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-slate-700 truncate">
                        {licenseImage ? licenseImage.name : "No file selected"}
                      </span>
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition ml-3 flex-shrink-0">
                      BROWSE
                    </span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-slate-500">Upload official pharmaceutical supplier license image.</p>
                {fieldErrors.licenseImage && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.licenseImage}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Phone Number
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251..."
                  className="mt-2 border border-slate-200 bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:border-green-400 focus-visible:ring-green-400/40"
                />
                <p className="mt-1 text-xs text-slate-500">Optional contact number.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Business Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 border border-slate-200 bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:border-green-400 focus-visible:ring-green-400/40"
                />
                <p className="mt-1 text-xs text-slate-500">Optional business location.</p>
              </div>
            </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-green-600 hover:bg-green-700 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-green-400/40"
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
              {loading ? (otpSent ? "Verifying..." : "Registering...") : (otpSent ? "Verify Email" : "Register as Supplier")}
            </Button>

            <p className="text-center text-xs text-slate-700">
              Already have a supplier account?{" "}
              <Link href="/supplier-signin" className="font-medium text-green-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-[11px] text-slate-700">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-green-600 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-green-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
    </>
  );
}