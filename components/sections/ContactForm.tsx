"use client";

import { Send } from "lucide-react";

export default function ContactForm() {
    return (
        <section className="py-20 px-6 relative z-10">
            <div className="max-w-3xl mx-auto">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-white/90 uppercase tracking-widest"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.12] transition-all duration-300 shadow-lg shadow-black/20"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-3">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-white/90 uppercase tracking-widest"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.12] transition-all duration-300 shadow-lg shadow-black/20"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-white/90 uppercase tracking-widest"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={6}
                            className="w-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/[0.12] transition-all duration-300 resize-none shadow-lg shadow-black/20"
                            placeholder="Tell us about your project..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 flex items-center gap-3"
                        >
                            <span className="relative z-10">Send Message</span>
                            <Send size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
