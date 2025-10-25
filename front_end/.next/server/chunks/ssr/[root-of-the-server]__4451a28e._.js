module.exports = [
"[project]/.next-internal/server/app/(marketing)/affiliate/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(marketing)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(marketing)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/(marketing)/affiliate/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import NavBar from "@/components/layout/NavBar";
// import Footer from "@/components/sections/Footer";
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { postForm } from "@/utils/api";
// import { useToast } from "@/components/ui/toast";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   Coins,
//   Share2,
//   Users,
//   TrendingUp,
//   ShieldCheck,
//   Sparkles,
// } from "lucide-react";
// export default function AffiliatePage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [mode, setMode] = useState<"signup" | "login">("signup");
//   const router = useRouter();
//   const search = useSearchParams();
//   const next = search?.get("next") || "/dashboard";
//   const { show } = useToast();
//   // Signup form state
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [loadingSignup, setLoadingSignup] = useState(false);
//   const [errorSignup, setErrorSignup] = useState<string | null>(null);
//   // Login form state
//   const [usernameLogin, setUsernameLogin] = useState("");
//   const [passwordLogin, setPasswordLogin] = useState("");
//   const [loadingLogin, setLoadingLogin] = useState(false);
//   const [errorLogin, setErrorLogin] = useState<string | null>(null);
//   useEffect(() => {
//     document.documentElement.style.scrollBehavior = "smooth";
//     return () => {
//       document.documentElement.style.scrollBehavior = "";
//     };
//   }, []);
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   const handleScrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth", block: "start" });
//       setIsOpen(false);
//     }
//   };
//   async function onSignup(e: any) {
//     e.preventDefault();
//     setErrorSignup(null);
//     setLoadingSignup(true);
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
//       // Mark as affiliate and persist tenant_id
//       try {
//         const [, payloadB64] = data.access_token.split(".");
//         const json = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
//         const rolesClaim: string[] = Array.isArray(json?.roles) ? json.roles : [];
//         const isAffiliate = rolesClaim.map((r: any) => String(r).toLowerCase()).includes("affiliate");
//         localStorage.setItem("is_affiliate", isAffiliate ? "true" : "false");
//       } catch { }
//       try {
//         const me = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"}/api/v1/auth/me`, {
//           headers: { Authorization: `Bearer ${data.access_token}` },
//         }).then(r => r.json()).catch(() => null);
//         if (me?.tenant_id) localStorage.setItem("tenant_id", String(me.tenant_id));
//       } catch { }
//       show({
//         variant: "success",
//         title: "Account created",
//         description: "Welcome! Continue to affiliate setup",
//       });
//       router.replace("/dashboard/affiliate/register");
//     } catch (err: any) {
//       const msg = err.message || "Signup failed";
//       setErrorSignup(msg);
//       show({ variant: "destructive", title: "Signup failed", description: msg });
//     } finally {
//       setLoadingSignup(false);
//     }
//   }
//   async function onLogin(e: any) {
//     e.preventDefault();
//     setErrorLogin(null);
//     setLoadingLogin(true);
//     try {
//       const data = await postForm<{
//         access_token: string;
//         refresh_token: string;
//         token_type: string;
//         expires_in: number;
//       }>("/api/v1/auth/login", { username: usernameLogin, password: passwordLogin });
//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("refresh_token", data.refresh_token);
//       // Detect affiliate via JWT roles claim
//       let isAffiliate = false;
//       try {
//         const [, payloadB64] = data.access_token.split(".");
//         const json = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
//         const rolesClaim: string[] = Array.isArray(json?.roles) ? json.roles : [];
//         isAffiliate = rolesClaim.map((r: any) => String(r).toLowerCase()).includes("affiliate");
//       } catch { }
//       localStorage.setItem("is_affiliate", isAffiliate ? "true" : "false");
//       try {
//         const me = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"}/api/v1/auth/me`, {
//           headers: { Authorization: `Bearer ${data.access_token}` },
//         }).then(r => r.json()).catch(() => null);
//         if (me?.tenant_id) localStorage.setItem("tenant_id", String(me.tenant_id));
//       } catch { }
//       show({ variant: "success", title: "Welcome", description: "Login successful" });
//       router.replace(isAffiliate ? "/dashboard/affiliate" : next);
//     } catch (err: any) {
//       const msg = err.message || "Login failed";
//       setErrorLogin(msg);
//       show({ variant: "destructive", title: "Login failed", description: msg });
//     } finally {
//       setLoadingLogin(false);
//     }
//   }
//   return (
//     <div className="min-h-screen bg-emerald-50">
//       <NavBar
//         isOpen={isOpen}
//         scrolled={scrolled}
//         setIsOpen={setIsOpen}
//         setScrolled={setScrolled}
//         handleScrollToSection={handleScrollToSection}
//       />
//       <main className="mx-auto max-w-6xl px-6 pt-28 pb-20">
//         {/* Hero */}
//         <section className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-green-50/70 to-emerald-100/60" />
//           <div className="relative px-8 py-12 md:px-12">
//             <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs text-emerald-800 backdrop-blur-sm">
//               <Sparkles className="h-3.5 w-3.5" />
//               Affiliate Program
//             </div>
//             <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-emerald-800">
//               Earn 5% recurring commission with Zemen Pharma
//             </h1>
//             <p className="mt-3 max-w-2xl text-emerald-800/80">
//               Invite pharmacies and healthcare businesses to Zemen Pharma. For every
//               active user you refer, you receive 5% of the income generated from that user.
//             </p>
//             <div className="mt-6 flex flex-col sm:flex-row gap-3">
//               <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
//                 <Link href="/affiliate-signup">Join the Affiliate Program</Link>
//               </Button>
//               <Button
//                 asChild
//                 variant="outline"
//                 className="border-emerald-200 text-emerald-800 hover:bg-emerald-50"
//               >
//                 <a href="#how-it-works">How it works</a>
//               </Button>
//             </div>
//             {/* Quick stats */}
//             <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
//               <div className="rounded-xl border border-emerald-200 bg-white/70 p-4 text-emerald-900/90">
//                 <div className="flex items-center gap-2 text-emerald-700">
//                   <Users className="h-4 w-4" />
//                   <span className="text-sm font-medium">For Creators & Partners</span>
//                 </div>
//                 <p className="mt-2 text-2xl font-semibold text-emerald-800">Unlimited</p>
//                 <p className="text-xs text-emerald-700/70">Referrals</p>
//               </div>
//               <div className="rounded-xl border border-emerald-200 bg-white/70 p-4 text-emerald-900/90">
//                 <div className="flex items-center gap-2 text-emerald-700">
//                   <Coins className="h-4 w-4" />
//                   <span className="text-sm font-medium">Commission</span>
//                 </div>
//                 <p className="mt-2 text-2xl font-semibold text-emerald-800">5%</p>
//                 <p className="text-xs text-emerald-700/70">Recurring</p>
//               </div>
//               <div className="rounded-xl border border-emerald-200 bg-white/70 p-4 text-emerald-900/90">
//                 <div className="flex items-center gap-2 text-emerald-700">
//                   <TrendingUp className="h-4 w-4" />
//                   <span className="text-sm font-medium">Growth Potential</span>
//                 </div>
//                 <p className="mt-2 text-2xl font-semibold text-emerald-800">High</p>
//                 <p className="text-xs text-emerald-700/70">Scale with your audience</p>
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* Join: Signup/Login */}
//         <section id="join" className="mt-12 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
//           <div className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-emerald-100/40 px-6 py-8">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-semibold text-emerald-800 mb-2">Join the Affiliate Program</h2>
//               <p className="text-emerald-700/80">Start earning recurring commissions today</p>
//             </div>
//             {/* Enhanced Tab Navigation */}
//             <div className="relative mb-8">
//               <div className="flex items-center justify-center">
//                 <div className="relative inline-flex bg-white/80 rounded-2xl p-1.5 border border-emerald-200/60 shadow-sm backdrop-blur-sm">
//                   {/* Background indicator */}
//                   <div
//                     id="tab-indicator"
//                     className={`absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg transition-all duration-300 ease-out ${mode === "signup"
//                       ? "left-1.5 w-[calc(50%-0.375rem)]"
//                       : "left-[calc(50%+0.375rem)] w-[calc(50%-0.375rem)]"
//                       }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setMode("signup")}
//                     onMouseEnter={() => {
//                       const indicator = document.getElementById("tab-indicator");
//                       if (indicator) {
//                         indicator.style.left = "0.375rem";
//                         indicator.style.width = "calc(50% - 0.375rem)";
//                       }
//                     }}
//                     onMouseLeave={() => {
//                       const indicator = document.getElementById("tab-indicator");
//                       if (indicator) {
//                         if (mode === "login") {
//                           indicator.style.left = "calc(50% + 0.375rem)";
//                           indicator.style.width = "calc(50% - 0.375rem)";
//                         }
//                       }
//                     }}
//                     className={`relative z-10 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${mode === "signup"
//                       ? "text-white"
//                       : "text-emerald-700 hover:text-emerald-700"
//                       }`}
//                   >
//                     <Users className="h-4 w-4" />
//                     Create Account
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setMode("login")}
//                     onMouseEnter={() => {
//                       const indicator = document.getElementById("tab-indicator");
//                       if (indicator) {
//                         indicator.style.left = "calc(50% + 0.375rem)";
//                         indicator.style.width = "calc(50% - 0.375rem)";
//                       }
//                     }}
//                     onMouseLeave={() => {
//                       const indicator = document.getElementById("tab-indicator");
//                       if (indicator) {
//                         if (mode === "signup") {
//                           indicator.style.left = "0.375rem";
//                           indicator.style.width = "calc(50% - 0.375rem)";
//                         }
//                       }
//                     }}
//                     className={`relative z-10 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${mode === "login"
//                       ? "text-white"
//                       : "text-emerald-700 hover:text-emerald-700"
//                       }`}
//                   >
//                     <ShieldCheck className="h-4 w-4" />
//                     Sign In
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="max-w-2xl mx-auto">
//               {mode === "signup" ? (
//                 <form onSubmit={onSignup} className="space-y-5">
//                   {errorSignup && (
//                     <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
//                       {errorSignup}
//                     </div>
//                   )}
//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">Email</label>
//                       <Input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         autoComplete="email"
//                         placeholder="you@example.com"
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">Username</label>
//                       <Input
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                         autoComplete="username"
//                         placeholder="your-username"
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">Password</label>
//                       <Input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         autoComplete="new-password"
//                         placeholder="••••••••"
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">Phone (optional)</label>
//                       <Input
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         placeholder="+2519..."
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">First name</label>
//                       <Input
//                         value={firstName}
//                         onChange={(e) => setFirstName(e.target.value)}
//                         placeholder="First name"
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">Last name</label>
//                       <Input
//                         value={lastName}
//                         onChange={(e) => setLastName(e.target.value)}
//                         placeholder="Last name"
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                   <Button
//                     type="submit"
//                     disabled={loadingSignup}
//                     className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                   >
//                     {loadingSignup ? (
//                       <span className="flex items-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         Creating Account...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         <Sparkles className="h-4 w-4" />
//                         Create Your Affiliate Account
//                       </span>
//                     )}
//                   </Button>
//                 </form>
//               ) : (
//                 <form onSubmit={onLogin} className="space-y-5">
//                   {errorLogin && (
//                     <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
//                       {errorLogin}
//                     </div>
//                   )}
//                   <div className="space-y-5">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">Username</label>
//                       <Input
//                         value={usernameLogin}
//                         onChange={(e) => setUsernameLogin(e.target.value)}
//                         required
//                         autoComplete="username"
//                         placeholder="your-username"
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-emerald-700">Password</label>
//                       <Input
//                         type="password"
//                         value={passwordLogin}
//                         onChange={(e) => setPasswordLogin(e.target.value)}
//                         required
//                         autoComplete="current-password"
//                         placeholder="••••••••"
//                         className="border-emerald-200 bg-white/70 text-emerald-900 placeholder:text-emerald-900/40 focus-visible:ring-2 focus-visible:ring-emerald-400/60 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                   <Button
//                     type="submit"
//                     disabled={loadingLogin}
//                     className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                   >
//                     {loadingLogin ? (
//                       <span className="flex items-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         Signing In...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-2">
//                         <ShieldCheck className="h-4 w-4" />
//                         Sign In to Your Account
//                       </span>
//                     )}
//                   </Button>
//                 </form>
//               )}
//             </div>
//           </div>
//         </section>
//         {/* How it works */}
//         <section id="how-it-works" className="mt-12 grid gap-8 md:grid-cols-2">
//           <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-emerald-800">How it works</h2>
//             <ol className="mt-4 space-y-4">
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
//                   1
//                 </span>
//                 <div>
//                   <p className="text-emerald-900/90">
//                     Sign up and receive your unique referral link.
//                   </p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
//                   2
//                 </span>
//                 <div>
//                   <p className="text-emerald-900/90">
//                     Share your link via social media, email, or website.
//                   </p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
//                   3
//                 </span>
//                 <div>
//                   <p className="text-emerald-900/90">
//                     When users sign up with your link, they become your referrals.
//                   </p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
//                   4
//                 </span>
//                 <div>
//                   <p className="text-emerald-900/90">
//                     Earn <span className="font-semibold">5% of the income</span> generated by
//                     each referred user.
//                   </p>
//                 </div>
//               </li>
//             </ol>
//             <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-sm text-emerald-800">
//               <Share2 className="h-4 w-4" />
//               Share more, earn more. Your audience size scales your earnings.
//             </div>
//           </div>
//           <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-emerald-800">Why join?</h2>
//             <ul className="mt-4 grid gap-4">
//               <li className="flex items-start gap-3">
//                 <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
//                 <div>
//                   <p className="font-medium text-emerald-900/90">Transparent revenue share</p>
//                   <p className="text-sm text-emerald-800/80">
//                     Straightforward 5% from every referred user’s income.
//                   </p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <TrendingUp className="mt-0.5 h-5 w-5 text-emerald-600" />
//                 <div>
//                   <p className="font-medium text-emerald-900/90">Recurring potential</p>
//                   <p className="text-sm text-emerald-800/80">
//                     Earn as long as your referrals keep using the platform.
//                   </p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <Users className="mt-0.5 h-5 w-5 text-emerald-600" />
//                 <div>
//                   <p className="font-medium text-emerald-900/90">Built for partners</p>
//                   <p className="text-sm text-emerald-800/80">
//                     Ideal for influencers, communities, and business networks.
//                   </p>
//                 </div>
//               </li>
//             </ul>
//             {/* Example */}
//             <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 text-emerald-900/90">
//               <p>
//                 If a referred user spends <span className="font-semibold">ETB 5,000</span> in a
//                 month, you earn <span className="font-semibold">5%</span> ={" "}
//                 <span className="font-semibold">ETB 250</span> for that month.
//               </p>
//             </div>
//           </div>
//         </section>
//         {/* CTA Banner */}
//         <section className="mt-12 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
//           <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-8 md:px-12">
//             <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h3 className="text-xl font-semibold text-emerald-800">
//                   Ready to start earning?
//                 </h3>
//                 <p className="mt-1 text-emerald-800/80">
//                   Join the program and get your referral link in minutes.
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
//                   <Link href="/affiliate-signup">Join Now</Link>
//                 </Button>
//                 <Button
//                   asChild
//                   variant="outline"
//                   className="border-emerald-200 text-emerald-800 hover:bg-emerald-50"
//                 >
//                   <Link href="/(marketing)/contact">Talk to us</Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* Light FAQ */}
//         <section className="mt-12 grid gap-4 md:grid-cols-3">
//           <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
//             <p className="text-sm font-semibold text-emerald-800">How are payouts handled?</p>
//             <p className="mt-1 text-sm text-emerald-800/80">
//               Payouts follow our standard verification and schedule. Details are provided in the
//               affiliate dashboard.
//             </p>
//           </div>
//           <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
//             <p className="text-sm font-semibold text-emerald-800">Is the 5% recurring?</p>
//             <p className="mt-1 text-sm text-emerald-800/80">
//               Yes. As long as your referral remains active and generates income, you continue
//               to earn 5%.
//             </p>
//           </div>
//           <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
//             <p className="text-sm font-semibold text-emerald-800">Any limits on referrals?</p>
//             <p className="mt-1 text-sm text-emerald-800/80">
//               No limits. The more qualified users you invite, the more you can earn.
//             </p>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }
// // "use client";
// // import Link from "next/link";
// // import { Button } from "@/components/ui/button";
// // import NavBar from "@/components/layout/NavBar";
// // import { useEffect, useState } from "react";
// // import Footer from "@/components/sections/Footer";
// // export default function AffiliatePage() {
// //     const [isOpen, setIsOpen] = useState(false);
// //     const [scrolled, setScrolled] = useState(false);
// //     useEffect(() => {
// //         document.documentElement.style.scrollBehavior = "smooth";
// //         return () => {
// //             document.documentElement.style.scrollBehavior = "";
// //         };
// //     }, []);
// //     useEffect(() => {
// //         const handleScroll = () => {
// //             setScrolled(window.scrollY > 50);
// //         };
// //         window.addEventListener("scroll", handleScroll);
// //         return () => window.removeEventListener("scroll", handleScroll);
// //     }, []);
// //     const handleScrollToSection = (sectionId: string) => {
// //         const element = document.getElementById(sectionId);
// //         if (element) {
// //             element.scrollIntoView({
// //                 behavior: "smooth",
// //                 block: "center",
// //             });
// //             setIsOpen(false);
// //         }
// //     };
// //     return (
// //         <div className="min-h-screen bg-emerald-50">
// //             <NavBar isOpen={isOpen}
// //                 scrolled={scrolled}
// //                 setIsOpen={setIsOpen}
// //                 setScrolled={setScrolled}
// //                 handleScrollToSection={handleScrollToSection} />
// //             <main className="mx-auto max-w-5xl px-6 py-20">
// //                 {/* Header */}
// //                 <div className="rounded-2xl border border-emerald-200 bg-white shadow-sm overflow-hidden">
// //                     <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100 px-8 py-8">
// //                         <h1 className="text-2xl md:text-3xl font-semibold text-emerald-800">
// //                             Zemen Pharma Affiliate Program
// //                         </h1>
// //                         <p className="mt-2 text-emerald-700/80">
// //                             Earn recurring commissions by inviting new users to Zemen Pharma. For each user
// //                             you refer, you receive <span className="font-semibold text-emerald-800">5% of the income</span>
// //                             generated from that user.
// //                         </p>
// //                     </div>
// //                     {/* Content */}
// //                     <div className="p-8 space-y-10">
// //                         {/* How it works */}
// //                         <section className="space-y-4">
// //                             <h2 className="text-lg font-semibold text-emerald-800">How it works</h2>
// //                             <ol className="list-decimal pl-5 space-y-2 text-emerald-900/90">
// //                                 <li>Sign up for the affiliate program and get your unique referral link.</li>
// //                                 <li>Share your link with your audience through social media, email, or your website.</li>
// //                                 <li>When someone signs up using your link, they become your referral.</li>
// //                                 <li>You earn <span className="font-semibold">5% of the income</span> generated by that referred user.</li>
// //                             </ol>
// //                         </section>
// //                         {/* Example */}
// //                         <section className="space-y-4">
// //                             <h2 className="text-lg font-semibold text-emerald-800">Example</h2>
// //                             <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 text-emerald-900/90">
// //                                 <p>
// //                                     If your referred user spends <span className="font-semibold">ETB 5,000</span> on Zemen Pharma in a month,
// //                                     your commission is <span className="font-semibold">5%</span>, which is{" "}
// //                                     <span className="font-semibold">ETB 250</span> for that month.
// //                                 </p>
// //                             </div>
// //                         </section>
// //                         {/* Benefits */}
// //                         <section className="space-y-4">
// //                             <h2 className="text-lg font-semibold text-emerald-800">Why join?</h2>
// //                             <ul className="list-disc pl-5 space-y-2 text-emerald-900/90">
// //                                 <li>Simple, transparent 5% revenue share from each referred user.</li>
// //                                 <li>Recurring potential as users continue using the platform.</li>
// //                                 <li>Marketing assets and guidance to help you promote effectively.</li>
// //                             </ul>
// //                         </section>
// //                         {/* CTA */}
// //                         <section className="flex flex-col sm:flex-row gap-3">
// //                             <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
// //                                 <Link href="/affiliate-signup">Join the Affiliate Program</Link>
// //                             </Button>
// //                             <Button asChild variant="outline" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50">
// //                                 <Link href="/contact">Contact Sales</Link>
// //                             </Button>
// //                         </section>
// //                         {/* FAQ-like notes */}
// //                         <section className="space-y-2 text-sm text-emerald-800/80">
// //                             <p>
// //                                 Payouts and timelines are subject to standard verification and our program terms.
// //                                 Make sure to review the guidelines before promoting.
// //                             </p>
// //                             <p>
// //                                 Need help? Visit our <Link href="/(marketing)" className="underline">blog</Link> or{" "}
// //                                 <Link href="/(marketing)/contact" className="underline">contact us</Link>.
// //                             </p>
// //                         </section>
// //                     </div>
// //                 </div>
// //             </main>
// //             <Footer />
// //         </div>
// //     );
// // }
}),
"[project]/app/(marketing)/affiliate/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(marketing)/affiliate/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4451a28e._.js.map