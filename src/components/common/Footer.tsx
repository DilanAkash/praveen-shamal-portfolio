import { motion } from "framer-motion";
import Container from "./Container";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden bg-[#070b12] pt-10 pb-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-emerald-500/10 via-purple-500/5 to-transparent blur-3xl" />

      {/* Top divider line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-6 h-px max-w-6xl bg-gradient-to-r from-transparent via-white/20 to-transparent origin-center"
      />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between
                     rounded-3xl border border-white/10 bg-white/5 px-5 py-5 md:px-7 md:py-6
                     backdrop-blur-2xl shadow-[0_22px_80px_rgba(0,0,0,0.85)]"
        >
          {/* Brand / copy */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Praveen Shamal Photography
            </p>
            <p className="text-sm text-gray-300">
              © {year} All rights reserved. Crafted for those who see life frame by frame.
            </p>
          </div>

          {/* Actions + credit */}
          <div className="flex flex-col items-start gap-3 text-sm md:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://wa.me/94766939162"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20
                           bg-black/60 px-4 py-2 backdrop-blur-md text-xs md:text-sm text-white/90
                           transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/10
                           hover:-translate-y-0.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WhatsApp Booking
              </a>
            </div>

            <p className="text-[11px] text-gray-400">
              Designed for{" "}
              <span className="text-white/90">cinematic storytelling</span>.{" "}
              <a
                href="https://dilanakash.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                Built by Dilan Akash
                <span className="text-[9px]">↗</span>
              </a>
            </p>
          </div>

          {/* subtle corner glow */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, x: 20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -bottom-10 -right-6 h-20 w-20 rounded-full
                       bg-emerald-400/18 blur-2xl"
          />
        </motion.div>
      </Container>
    </footer>
  );
}
