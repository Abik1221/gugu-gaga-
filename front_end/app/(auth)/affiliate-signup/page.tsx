"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postForm } from "@/utils/api";
import { useToast } from "@/components/ui/toast";
import googleIcon from "@/public/googleIcon.png"
import Image from "next/image";
export default function AffiliateSignupPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get("next") || "/dashboard/affiliate/register";
  const { show } = useToast();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGoogle() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/api/v1/oauth/google/auth-url`
      );
      if (!res.ok) throw new Error(`Failed ${res.status}`);
      const data = await res.json();
      const url = data?.auth_url as string;
      if (url) {
        window.location.href = url;
      }
    } catch (e: any) {
      setError(e.message || "Failed to start Google OAuth");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Client-side password validation to match backend policy
      const pw = password.trim();
      const hasMinLen = pw.length >= 8;
      const hasUpper = /[A-Z]/.test(pw);
      const hasLower = /[a-z]/.test(pw);
      const hasDigit = /\d/.test(pw);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\/\\\[\];'`~+=]/.test(pw);
      if (!(hasMinLen && hasUpper && hasLower && hasDigit && hasSpecial)) {
        const msg = "Password must be at least 8 characters and include upper, lower, number, and special character.";
        setError(msg);
        show({ variant: "destructive", title: "Weak password", description: msg });
        return;
      }
      const data = await postForm<{
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
      }>("/api/v1/auth/signup-affiliate", {
        email,
        username,
        password: pw,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      show({
        variant: "success",
        title: "Account created",
        description: "Welcome! Continue to affiliate setup",
      });
      router.replace(next);
    } catch (err: any) {
      setError(err.message || "Signup failed");
      show({
        variant: "destructive",
        title: "Signup failed",
        description: err.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full sm:w-[520px] rounded-2xl border border-emerald-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100 px-6 py-5">
            <h1 className="text-xl font-semibold text-emerald-800">Affiliate Sign Up</h1>
            <p className="text-sm text-emerald-700/80 mt-1">
              Create your affiliate account to start earning with Zemen Pharma.
            </p>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-5">
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              type="button"
              variant="outline"
              onClick={onGoogle}
              className="w-full border-emerald-200 bg-emerald-50/40 text-emerald-800 hover:bg-emerald-50"
            >
              <Image src={googleIcon} alt="Google" width={24} height={24} />
            </Button>

            <div className="text-xs text-emerald-700/60 text-center">or</div>

            <div className="space-y-1">
              <label className="text-sm text-emerald-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-emerald-700">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="your-username"
                className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-emerald-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm text-emerald-700">First name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-emerald-700">Last name</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-emerald-700">Phone (optional)</label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+2519..."
                className="border-emerald-200 bg-emerald-50/40 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <div className="text-xs text-emerald-700/70">
              Already have an account?{" "}
              <a className="underline text-emerald-700" href={`/auth?next=${encodeURIComponent(next)}`}>
                Sign in
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

// "use client";
// import React, { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { postForm } from "@/utils/api";
// import { useToast } from "@/components/ui/toast";

// export default function AffiliateSignupPage() {
//   const router = useRouter();
//   const search = useSearchParams();
//   const next = search?.get("next") || "/dashboard/affiliate/register";
//   const { show } = useToast();

//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function onGoogle() {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/api/v1/oauth/google/auth-url`);
//       if (!res.ok) throw new Error(`Failed ${res.status}`);
//       const data = await res.json();
//       const url = data?.auth_url as string;
//       if (url) {
//         window.location.href = url;
//       }
//     } catch (e: any) {
//       setError(e.message || "Failed to start Google OAuth");
//     }
//   }

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       const data = await postForm<{
//         access_token: string;
//         refresh_token: string;
//         token_type: string;
//         expires_in: number;
//       }>("/api/v1/auth/signup-affiliate", {
//         email,
//         username,
//         password,
//         first_name: firstName,
//         last_name: lastName,
//         phone_number: phoneNumber,
//       });
//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("refresh_token", data.refresh_token);
//       show({ variant: "success", title: "Account created", description: "Welcome! Continue to affiliate setup" });
//       router.replace(next);
//     } catch (err: any) {
//       setError(err.message || "Signup failed");
//       show({ variant: "destructive", title: "Signup failed", description: err.message || "Please try again" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-emerald-50">
//       <main className="flex-1 flex items-center justify-center p-6">
//         <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-white border rounded p-6 shadow-sm">
//           <h1 className="text-2xl font-semibold">Affiliate Sign Up</h1>
//           {error && <p className="text-red-600 text-sm">{error}</p>}
//           <Button type="button" variant="outline" onClick={onGoogle} className="w-full">Continue with Google</Button>
//           <div className="text-xs text-gray-400 text-center">or</div>
//           <div>
//             <label className="text-sm">Email</label>
//             <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
//           </div>
//           <div>
//             <label className="text-sm">Username</label>
//             <Input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
//           </div>
//           <div>
//             <label className="text-sm">Password</label>
//             <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="text-sm">First name</label>
//               <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//             </div>
//             <div>
//               <label className="text-sm">Last name</label>
//               <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
//             </div>
//           </div>
//           <div>
//             <label className="text-sm">Phone (optional)</label>
//             <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
//           </div>
//           <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Create Account"}</Button>
//           <div className="text-xs text-gray-500">
//             Already have an account? <a className="underline" href={`/auth?next=${encodeURIComponent(next)}`}>Sign in</a>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// }
