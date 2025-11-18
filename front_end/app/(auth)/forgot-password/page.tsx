"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ErrorDialog } from "@/components/ui/error-dialog";
import { postJSON } from "@/utils/api";
import { ArrowLeft, Mail, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import AuthNavBar from "@/components/layout/AuthNavBar";
import { OtpSentDialog } from "@/components/ui/otp-sent-dialog";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const show = (toast: any) => {
    if (typeof window !== 'undefined') {
      console.log('Toast:', toast.title, toast.description);
    }
  };
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "error" | "warning" | "success";
  }>({ isOpen: false, title: "", message: "", type: "error" });

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postJSON("/api/v1/auth/password/reset/request", { email });

      setStep("code");
      setShowOtpDialog(true);
    } catch (error: any) {
      const message = error.message || "Failed to send reset code";
      
      if (message.includes("No account")) {
        setErrorDialog({
          isOpen: true,
          title: "Account Not Found",
          message: `We couldn't find an account with the email "${email}". Please check your email address and try again.`,
          type: "error",
        });
      } else {
        setErrorDialog({
          isOpen: true,
          title: "Something Went Wrong",
          message: message,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorDialog({
        isOpen: true,
        title: "Passwords Don't Match",
        message: "The passwords you entered don't match. Please make sure both password fields are identical.",
        type: "warning",
      });
      return;
    }

    if (newPassword.length < 8) {
      setErrorDialog({
        isOpen: true,
        title: "Password Too Short",
        message: "Your password must be at least 8 characters long for security. Please choose a stronger password.",
        type: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      await postJSON("/api/v1/auth/password/reset/confirm", {
        email,
        code,
        new_password: newPassword,
      });

      setErrorDialog({
        isOpen: true,
        title: "Password Reset Complete!",
        message: "Your password has been successfully reset. You can now sign in with your new password.",
        type: "success",
      });

      setTimeout(() => {
        router.push("/");
      }, 2500);
    } catch (error: any) {
      const message = error.message || "Failed to reset password";
      
      if (message.includes("No account")) {
        setErrorDialog({
          isOpen: true,
          title: "Account Not Found",
          message: `We couldn't find an account with the email "${email}". Please check your email address.`,
          type: "error",
        });
      } else if (message.includes("Invalid") || message.includes("expired")) {
        setErrorDialog({
          isOpen: true,
          title: "Invalid or Expired Code",
          message: "The verification code you entered is invalid or has expired. Please request a new code and try again.",
          type: "error",
        });
      } else {
        setErrorDialog({
          isOpen: true,
          title: "Reset Failed",
          message: message,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavBar />
      <OtpSentDialog 
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={email}
        purpose="password_reset"
      />
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        title={errorDialog.title}
        message={errorDialog.message}
        type={errorDialog.type}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            {step === "email"
              ? "Enter your email to receive a reset code"
              : "Enter the code and your new password"}
          </p>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  autoFocus
                />
                <p className="text-xs text-gray-500">Enter the email associated with your account</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>

              <div className="text-center text-sm">
                <Link href="/" className="text-emerald-600 hover:text-emerald-700">
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Reset Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  maxLength={6}
                  className="h-11 text-center text-lg tracking-widest"
                  autoFocus
                />
                <p className="text-xs text-gray-500">Check your email ({email}) for the 6-digit code</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>

              <div className="text-center text-sm space-y-2">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-emerald-600 hover:text-emerald-700 block w-full"
                >
                  Didn't receive code? Try again
                </button>
                <Link href="/" className="text-gray-600 hover:text-gray-900 block">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
