"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import clsx from "clsx";

interface CaptionDisplayProps {
    caption: string;
    isLoading: boolean;
    onRegenerate: () => void;
}

export default function CaptionDisplay({
    caption,
    isLoading,
    onRegenerate,
}: CaptionDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!caption && !isLoading) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto mt-8"
        >
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        <p className="text-sm font-medium text-zinc-500 animate-pulse">
                            Analyzing image...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="prose dark:prose-invert">
                            <p className="text-lg text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                                {caption}
                            </p>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={onRegenerate}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Regenerate</span>
                            </button>
                            <button
                                onClick={handleCopy}
                                className={clsx(
                                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    copied
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                )}
                            >
                                {copied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                                <span>{copied ? "Copied!" : "Copy Caption"}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
