"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AuthAPI } from "@/utils/api";
import Image from "next/image";
import ownerRegistrationImage from "@/public/owner_registration.jpeg";
import AuthNavBar from "@/components/layout/AuthNavBar";
import { OtpSentDialog } from "@/components/ui/otp-sent-dialog";

type FieldKey = "businessName" | "email" | "password" | "tinNumber" | "phone" | "address" | "licenseFile";

const createEmptyFieldErrors = (): Record<FieldKey, string | null> => ({
  businessName: null,
  email: null,
  password: null,
  tinNumber: null,
  phone: null,
  address: null,
  licenseFile: null,
});

export default function OwnerRegisterPage() {
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

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [affiliateToken, setAffiliateToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for affiliate token from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const refToken = urlParams.get('ref') || localStorage.getItem('affiliate_token');
    if (refToken) {
      setAffiliateToken(refToken);
      localStorage.removeItem('affiliate_token'); // Clean up
    }
  }, []);

  const clearFieldError = (key: FieldKey) =>
    setFieldErrors((prev) => ({
      ...prev,
      [key]: null,
    }));

  async function submitOwner(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors(createEmptyFieldErrors());

    const trimmedBusinessName = businessName.trim();
    const trimmedEmail = email.trim();
    const trimmedTinNumber = tinNumber.trim();

    const validationErrors: Partial<Record<FieldKey, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedBusinessName) {
      validationErrors.businessName = "Enter your business name.";
    }
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      validationErrors.email = "Enter a valid email address.";
    }
    if (!password || password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }
    if (!trimmedTinNumber) {
      validationErrors.tinNumber = "Provide your TIN number.";
    }
    if (!licenseFile) {
      validationErrors.licenseFile = "Business license document is required.";
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
      let licenseMime = "";
      let licenseName = "";
      
      if (licenseFile) {
        const reader = new FileReader();
        licenseBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(licenseFile);
        });
        licenseMime = licenseFile.type;
        licenseName = licenseFile.name;
      }

      const data = await AuthAPI.registerPharmacy({
        pharmacy_name: trimmedBusinessName,
        owner_email: trimmedEmail,
        owner_password: password,
        pharmacy_license_number: trimmedTinNumber,
        owner_phone: phone || undefined,
        address: address || undefined,
        id_number: trimmedTinNumber,
        license_document_base64: licenseBase64,
        license_document_mime: licenseMime,
        license_document_name: licenseName,
        affiliate_token: affiliateToken,
      });


      
      // Store tokens immediately after registration
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token", data.access_token); // Also store as 'token'
      }
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      if (data.tenant_id) {
        localStorage.setItem("tenant_id", data.tenant_id);
      }
      if (data.user?.role) {
        localStorage.setItem("user_role", data.user.role);
      }

      setRegisteredEmail(trimmedEmail);
      setOtpSent(true);
      setSuccess("Registration successful! Check your email for verification code.");
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
      if (verifyData.user?.tenant_id) {
        localStorage.setItem("tenant_id", verifyData.user.tenant_id);
      }
      if (verifyData.user?.role) {
        localStorage.setItem("user_role", verifyData.user.role);
      }

      show({
        variant: "success",
        title: "Verified",
        description: "Redirecting to dashboard...",
      });
      setTimeout(() => window.location.href = "/dashboard/owner", 1500);
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      show({ variant: "destructive", title: "Verification Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  }

  const featureBullets = [
    "Multi-branch business management",
    "AI-powered inventory optimization",
    "Real-time sales analytics",
    "Staff management system",
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
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 h-80 w-80 rounded-full bg-green-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="relative flex flex-col justify-between overflow-hidden bg-white p-6 sm:p-12 lg:flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg mx-auto lg:mx-0"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 text-center lg:text-left">
              <span className="text-2xl font-semibold tracking-wide text-black">
                Mesob AI
              </span>
            </div>

            <h1 className="mt-10 text-4xl font-bold leading-tight text-black text-center lg:text-left">
              Start your business management journey
            </h1>
            <p className="mt-4 text-lg text-slate-500 text-center lg:text-left">
              Join thousands of business owners who trust our AI-powered platform to streamline their operations and boost profitability.
            </p>

            <ul className="mt-10 space-y-4 text-slate-700">
              {featureBullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-black" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Image
              src={ownerRegistrationImage}
              alt="Business owner registration"
              className="mt-8 rounded-xl shadow-lg mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-4 text-sm text-slate-700 text-center lg:text-left mt-8 lg:mt-0"
          >
            <p>
              "Mesob has revolutionized how we manage our business. The AI insights are incredible!"
            </p>
            <div className="h-px w-24 bg-black/20 mx-auto lg:mx-0" />
            <p>
              Need help? <Link href="/contact" className="text-black hover:underline">Contact our support team</Link>
            </p>
          </motion.div>
        </div>

        <div className="relative flex flex-col justify-center px-4 py-16 sm:px-10 lg:w-[560px] lg:px-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-[0_25px_80px_-40px_rgba(34,197,94,0.65)] backdrop-blur"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-black">Register as Business Owner</h2>
            <p className="mt-2 text-sm text-slate-600">
              Create your business management account today.
            </p>
            {affiliateToken && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Referred by affiliate
              </div>
            )}
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

          {otpSent ? (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                  Verification Code*
                </label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="mt-2 border border-slate-200 bg-white/5 text-slate-700 text-center text-2xl tracking-widest"
                />
                <p className="mt-2 text-xs text-slate-600">Check your email for the verification code</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-green-600 hover:bg-green-700 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/30 transition duration-300 hover:scale-[1.01] hover:shadow-green-400/40"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitOwner} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                Business Name*
              </label>
              <Input
                value={businessName}
                onChange={(e) => {
                  clearFieldError("businessName");
                  setBusinessName(e.target.value);
                }}
                className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:ring-2 ${fieldErrors.businessName
                  ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                  : "border-slate-200 focus-visible:border-green-400 focus-visible:ring-green-400/50"
                  }`}
              />
              {fieldErrors.businessName && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.businessName}</p>
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
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
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
                placeholder="Tax Identification Number"
                className={`mt-2 border bg-white/5 text-slate-700 placeholder:text-slate-700 transition focus-visible:ring-2 ${fieldErrors.tinNumber
                  ? "border-red-400/60 focus-visible:border-red-300 focus-visible:ring-red-300/60"
                  : "border-slate-200 focus-visible:border-green-400 focus-visible:ring-green-400/50"
                  }`}
              />
              {fieldErrors.tinNumber && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.tinNumber}</p>
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
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-900">
                Business License Document*
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  clearFieldError("licenseFile");
                  setLicenseFile(e.target.files?.[0] || null);
                }}
                className={`mt-2 w-full text-xs text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 ${fieldErrors.licenseFile ? 'border border-red-400' : ''}`}
              />
              {licenseFile && (
                <p className="mt-1 text-xs text-slate-600">Selected: {licenseFile.name}</p>
              )}
              {fieldErrors.licenseFile && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.licenseFile}</p>
              )}
            </div>

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
              {loading ? "Registering..." : "Register as Owner"}
            </Button>

          </form>
          )}

          {!otpSent && (
            <p className="mt-4 text-center text-xs text-slate-700">
              Already have an account?{" "}
              <Link href="/owner-signin" className="font-medium text-green-600 hover:underline">
                Sign in
              </Link>
            </p>
          )}

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
    </div>
    </>
  );
}