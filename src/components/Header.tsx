"use client";

import { Sparkles } from "lucide-react";

export default function Header() {
    return (
        <header className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    AI Powered
                </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                Image Caption Generator
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-md">
                Upload an image and let AI craft the perfect caption for your social media.
            </p>
        </header>
    );
}
