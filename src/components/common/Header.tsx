import { useEffect, useState } from "react";
import Container from "./Container";
import logo from "/src/assets/voux-white.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase =
    "relative px-3 py-2 text-sm font-medium text-gray-100/90 hover:text-white transition-all duration-300";
  const linkUnderline =
    "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-2"
          : "bg-black/50 backdrop-blur-md border-b border-white/5 py-4",
      ].join(" ")}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Brand */}
          <a 
            href="#hero" 
            className="group inline-flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={logo}
              alt="Voux — Praveen Shamal"
              className={[
                "w-auto select-none transition-all duration-500",
                scrolled ? "h-9" : "h-11"
              ].join(" ")}
              draggable="false"
            />
            <span className="sr-only">Praveen Shamal</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl px-2 py-2 shadow-lg">
              <a href="#gallery" className={`${linkBase} ${linkUnderline} rounded-full hover:bg-white/10`}>
                Work
              </a>
              <a href="#about" className={`${linkBase} ${linkUnderline} rounded-full hover:bg-white/10`}>
                About
              </a>
              <a href="#contact" className={`${linkBase} ${linkUnderline} rounded-full hover:bg-white/10`}>
                Contact
              </a>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-xl text-white/90 hover:bg-white/10 hover:border-white/25 transition-all duration-300"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="relative w-5 h-5">
              <span
                className={[
                  "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all duration-300 origin-center",
                  open ? "rotate-45 top-2.5" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-2.5 h-0.5 w-5 bg-current transition-all duration-300",
                  open ? "opacity-0" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-3.5 h-0.5 w-5 bg-current transition-all duration-300 origin-center",
                  open ? "-rotate-45 top-2.5" : "",
                ].join(" ")}
              />
            </div>
          </button>
        </nav>
      </Container>

      {/* Mobile sheet */}
      <div
        className={[
          "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <Container>
          <div className="mt-2 mb-4 rounded-2xl border border-white/15 bg-black/40 backdrop-blur-2xl p-1 shadow-2xl">
            <a
              href="#gallery"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-100/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              Work
            </a>
            <a
              href="#about"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-100/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-100/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              Contact
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}