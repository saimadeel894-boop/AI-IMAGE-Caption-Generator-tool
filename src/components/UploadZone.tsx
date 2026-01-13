"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
    selectedImage: string | null;
    onClear: () => void;
}

export default function UploadZone({
    onFileSelect,
    selectedImage,
    onClear,
}: UploadZoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        multiple: false,
        disabled: !!selectedImage,
    });

    return (
        <div className="w-full max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                {!selectedImage ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        {...(getRootProps() as any)}
                        className={clsx(
                            "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ease-in-out cursor-pointer group overflow-hidden",
                            isDragActive
                                ? "border-blue-500 bg-blue-500/5"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                    {isDragActive ? "Drop it here!" : "Click or drag to upload"}
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Supports PNG, JPG, WEBP
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black"
                    >
                        <Image
                            src={selectedImage}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
