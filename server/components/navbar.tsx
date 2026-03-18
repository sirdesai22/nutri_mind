"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "rgba(13,18,16,0.7)"
            : "rgba(13,18,16,0)",
          borderBottomColor: scrolled
            ? "rgba(168,255,107,0.08)"
            : "rgba(168,255,107,0)",
          boxShadow: scrolled
            ? "0 12px 40px rgba(0,0,0,0.6)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-40 border-b border-transparent backdrop-blur-[16px]"
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-20">
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-[20px] font-semibold tracking-tight"
          >
            <img src="/logo.png" alt="NutriMind logo" className="h-8 w-8 rounded-[8px]" />
            <span className="font-[var(--font-syne)] text-[#EFF5F0]">Nutri</span>
            <span className="font-[var(--font-syne)] text-[#A8FF6B]">Mind</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-[#566356] transition-colors duration-200 hover:text-[#EFF5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="rounded-2xl bg-[#A8FF6B] px-5 py-2.5 text-[14px] font-semibold text-[#0D1210] transition-transform duration-200 hover:brightness-110 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210]"
            >
              Get Started
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(168,255,107,0.18)] bg-[#131A17]/80 p-2 text-[#EFF5F0] transition-colors duration-200 hover:bg-[#1C2620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1210] md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -16, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[64px] z-30 overflow-hidden border-b border-[rgba(168,255,107,0.08)] bg-[#131A17] md:hidden"
          >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-[16px] font-medium text-[#EFF5F0] transition-colors duration-200 hover:text-[#A8FF6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131A17]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[#A8FF6B] px-6 py-3 text-[15px] font-semibold text-[#0D1210] transition-transform duration-200 hover:brightness-110 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8FF6B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131A17]"
              >
                Get Started
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

