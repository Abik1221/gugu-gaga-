"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpdateDialogProps {
    open: boolean;
    onUpdate: () => void;
    onDismiss: () => void;
}

export function UpdateDialog({ open, onUpdate, onDismiss }: UpdateDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onDismiss}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-8 overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10" />
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10" />

                        <div className="flex flex-col items-center text-center space-y-6">
                            {/* Icon */}
                            <div className="relative">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center rotate-3">
                                    <Sparkles className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin-slow" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    New Update Available
                                </h2>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    A new version of Mesob is ready! Update now to get the latest features and improvements.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                                <Button
                                    onClick={onUpdate}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl text-base font-medium shadow-lg shadow-emerald-200/50 transition-all hover:scale-[1.02]"
                                >
                                    Update Now
                                </Button>
                                <Button
                                    onClick={onDismiss}
                                    variant="ghost"
                                    className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-12 rounded-xl"
                                >
                                    Not Now
                                </Button>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onDismiss}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
