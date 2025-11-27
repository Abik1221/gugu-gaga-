"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, CheckCircle } from "lucide-react";
import { Button } from "./button";
import { useLanguage } from "@/contexts/language-context";

interface OtpSentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  purpose?: "register" | "login" | "password_reset";
}

export function OtpSentDialog({ isOpen, onClose, email }: OtpSentDialogProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-2xl max-w-sm w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="p-3 bg-white rounded-full shadow-sm"
                >
                  <Mail className="w-10 h-10 text-emerald-600" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <h3 className="text-xl font-bold text-gray-900">{t.dialogs.otpSentTitle}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t.dialogs.otpSentMessage} <br />
                    <span className="font-semibold text-gray-900">{email}</span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full pt-2"
                >
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2.5 rounded-xl shadow-lg"
                  >
                    {t.dialogs.otpSentButton}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}