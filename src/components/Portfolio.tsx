import {
  motion,
  useScroll,
  useTransform,
  type Easing,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

import { useLenis } from "../hooks/useLenis";

import Header from "./common/Header";
import Footer from "./common/Footer";
import Container from "./common/Container";
import Section from "./common/Section";
import MasonryGallery from "./media/MasonryGallery";
import Hero from "./sections/Hero";

/* ---------- Motion + Variants ---------- */

const cinematicEase: Easing = [0.22, 1, 0.36, 1];

const textContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: cinematicEase },
  },
};

/* ---------- Content ---------- */

const aboutHighlights = [
  {
    title: "Cinematic Storyteller",
    description:
      "Every frame is treated like a scene from a film — layered with emotion, rhythm, and atmospheric lighting that invites the viewer to linger.",
  },
  {
    title: "Global Perspective",
    description:
      "Years of traveling across Sri Lanka and beyond shaped a visual language that blends local heritage with contemporary aesthetics.",
  },
  {
    title: "Human-First Approach",
    description:
      "𝖯𝖱𝖠𝖵𝖤𝖤𝖭 𝖪𝖠𝖱𝖴𝖭𝖠𝖱𝖠𝖳𝖧𝖠 builds trust with every subject, capturing the quiet moments in-between that often tell the most powerful stories.",
  },
];

const experienceTimeline = [
  {
    year: "2018",
    title: "First Frame",
    description:
      "Picked up a camera and never looked back — documenting friends, music gigs, and the energy of Colombo nights.",
  },
  {
    year: "2020",
    title: "Weddings & Editorial",
    description:
      "Launched a boutique studio delivering intimate wedding narratives and editorial campaigns for local fashion labels.",
  },
  {
    year: "2022",
    title: "Cinematic Collective",
    description:
      "Co-founded a creative collective, blending film-inspired direction with experimental lighting for brands and artists.",
  },
  {
    year: "2024",
    title: "Beyond the Lens",
    description:
      "Expanding into motion reels, immersive experiences, and mentoring the next wave of visual storytellers in Sri Lanka.",
  },
];

const serviceCards = [
  {
    title: "Wedding Films & Photography",
    tagline: "Romantic, cinematic, and intimately choreographed",
    points: ["Documentary-style storytelling", "Heirloom albums", "Same-day highlight reels"],
  },
  {
    title: "Editorial & Commercial",
    tagline: "Bold visuals crafted for brands and artists",
    points: ["Creative direction", "Artful retouching", "On-location lighting design"],
  },
  {
    title: "Portraits & Lifestyle",
    tagline: "Authentic, atmospheric portraits that celebrate individuality",
    points: ["Studio or natural light", "Cinematic color grading", "Wardrobe & styling guidance"],
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/praveen_shamal/?hl=en",
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@praveen_shamal",
  },
  {
    label: "Facebook",
    href: "https://web.facebook.com/praveen.shamal.71",
  },
];

/* ---------- Minimal inline icon set (no extra deps) ---------- */

const SocialIcon = ({ label }: { label: string }) => {
  const size = 16;
  const stroke = "currentColor";
  const lower = label.toLowerCase();

  if (lower.includes("instagram")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke={stroke}
          strokeWidth="1.7"
        />
        <circle
          cx="12"
          cy="12"
          r="4.3"
          fill="none"
          stroke={stroke}
          strokeWidth="1.7"
        />
        <circle cx="17.2" cy="6.8" r="1.2" fill={stroke} />
      </svg>
    );
  }

  if (lower.includes("threads")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={stroke}
          strokeWidth="1.7"
        />
        <path
          d="M9 8.8c.6-1 1.6-1.5 3-1.5 2.1 0 3.6 1.3 3.6 3.7 0 2.7-1.7 4.7-4.5 4.7-1.4 0-2.3-.5-2.9-1.2"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.6 10.4c-.4-.3-.9-.5-1.6-.5-1.1 0-2 .7-2 1.8 0 1.2.8 2 2.1 2"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (lower.includes("facebook")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14.5 8H16V5.5h-1.7C11.9 5.5 11 7.2 11 9.2V11H9v2.4h2V19h2.5v-5.6H16V11h-2.5v-1.6c0-.9.4-1.4 1-1.4Z"
          fill={stroke}
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke={stroke}
        strokeWidth="1.7"
      />
    </svg>
  );
};

/* ---------- Page ---------- */

export default function Portfolio() {
  useLenis();

  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const glowTranslate = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-black via-[#05070d] to-[#070b12] text-white">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            style={{ y: glowTranslate }}
            className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[160px]"
          />
          <motion.div
            style={{ y: glowTranslate }}
            className="absolute top-1/3 right-[-120px] h-[360px] w-[360px] rounded-full bg-purple-600/20 blur-[140px]"
          />
          <motion.div
            style={{ y: glowTranslate }}
            className="absolute bottom-[-160px] left-[-80px] h-[380px] w-[380px] rounded-full bg-sky-500/20 blur-[180px]"
          />
        </div>

        {/* HERO */}
        <Hero />

        {/* ABOUT */}
        <Section id="about" className="relative py-24 md:py-32">
          <Container>
            <motion.div
              ref={parallaxRef}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: cinematicEase }}
              className="mx-auto max-w-5xl text-center md:text-left"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
                Meet the storyteller
              </p>
              <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                𝖯𝖱𝖠𝖵𝖤𝖤𝖭 𝖪𝖠𝖱𝖴𝖭𝖠𝖱𝖠𝖳𝖧𝖠
              </h2>
              <motion.p
                variants={textContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                className="mt-6 text-lg leading-relaxed text-gray-300 md:text-xl"
              >
                <motion.span variants={textItem}>
                  Based in Sri Lanka, Praveen is an visual artist known
                  for cinematic compositions that feel like fragments of an untold film.
                </motion.span>{" "}
                <motion.span variants={textItem}>
                  His work merges carefully engineered lighting with an instinct for human
                  connection, resulting in frames that resonate long after the shutter closes.
                </motion.span>{" "}
                <motion.span variants={textItem}>
                  Whether documenting once-in-a-lifetime celebrations or crafting editorial
                  stories for brands, Praveen crafts experiences where every detail is choreographed
                  to perfection.
                </motion.span>
              </motion.p>
            </motion.div>

            {/* About highlight cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: cinematicEase }}
              className="mt-16 grid gap-8 md:grid-cols-3"
            >
              {aboutHighlights.map((highlight) => (
                <motion.article
                  key={highlight.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/60 hover:bg-white/10"
                >
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition duration-500 group-hover:bg-emerald-400/20" />
                  <h3 className="text-2xl font-semibold text-white">
                    {highlight.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">
                    {highlight.description}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </Container>
        </Section>

        {/* EXPERIENCE TIMELINE */}
        <Section className="py-24 md:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="mx-auto mb-16 max-w-3xl text-center"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
                Origins & evolution
              </p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                A reel of milestones
              </h2>
              <p className="mt-6 text-gray-400">
                From documentary beginnings to immersive cinematic experiences, every
                chapter sharpened the craft and elevated the visual language.
              </p>
            </motion.div>

            <div className="relative mx-auto max-w-5xl">
              <div className="absolute left-4 h-full w-px bg-gradient-to-b from-white/60 via-white/20 to-transparent md:left-1/2" />
              <div className="flex flex-col gap-12 md:gap-16">
                {experienceTimeline.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: cinematicEase }}
                    className={`relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] ${
                      index % 2 === 0
                        ? "md:ml-0 md:mr-[55%]"
                        : "md:ml-[55%] md:mr-0"
                    }`}
                  >
                    <span className="mb-3 inline-flex items-center rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                      {milestone.year}
                    </span>
                    <h3 className="text-2xl font-semibold text-white">
                      {milestone.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-gray-300">
                      {milestone.description}
                    </p>
                    <div className="absolute -left-1.5 top-6 h-3 w-3 rounded-full border border-purple-400/40 bg-black md:left-auto md:right-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* PORTFOLIO GALLERY */}
        <Section id="gallery" className="py-24 md:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
                Selected work
              </p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                Portfolio Highlights
              </h2>
              <p className="mt-4 text-base text-gray-400 md:text-lg">
                A curated mix of weddings, editorials, and portrait narratives —
                crafted with cinematic light, textured color, and honest emotion.
              </p>
            </motion.div>
            <MasonryGallery />
          </Container>
        </Section>

        {/* SERVICES */}
        <Section className="py-24 md:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="mx-auto mb-16 max-w-3xl text-center"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
                Crafted experiences
              </p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                Services designed for impact
              </h2>
              <p className="mt-6 text-gray-400">
                Each offering is tailored end-to-end — from concept development
                and mood boards to on-site direction, sound design, and final delivery.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {serviceCards.map((service) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7 }}
                  whileHover={{ y: -12 }}
                  className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 backdrop-blur-xl transition-transform duration-500"
                >
                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-sky-500/20 blur-3xl" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm uppercase tracking-[0.2em] text-emerald-300">
                    {service.tagline}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-gray-300">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <span className="inline-flex items-center text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-x-1">
                      Discover more →
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </Container>
        </Section>

        {/* CONTACT CTA — MATCHED TO CINEMATIC FOOTER */}
        <Section id="contact" className="relative pt-24 pb-10 md:pt-32 md:pb-16">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: cinematicEase }}
              className="relative overflow-hidden rounded-[40px]
                         border border-white/14
                         bg-gradient-to-br from-black/90 via-slate-950/95 to-black
                         px-8 py-9 md:px-14 md:py-14
                         backdrop-blur-2xl
                         shadow-[0_28px_120px_rgba(0,0,0,0.9)]"
            >
              {/* Floating outlines */}
              <motion.div
                aria-hidden
                animate={{ rotate: [0, 6, 0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-28 right-10 h-40 w-40 rounded-full border border-emerald-400/25"
              />
              <motion.div
                aria-hidden
                animate={{ rotate: [0, -5, 0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 26, ease: "easeInOut" }}
                className="pointer-events-none absolute -bottom-40 left-8 h-64 w-64 rounded-full border border-purple-500/18"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.10]
                           bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.5),transparent_70%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.45),transparent_75%)]"
              />

              <div className="relative grid gap-10 md:grid-cols-[1.6fr_1.1fr] md:items-center">
                {/* Left: Main messaging */}
                <div>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-emerald-300/80">
                    Booking & Collaborations
                  </p>
                  <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                    Let&apos;s turn your story into a frame they can&apos;t forget.
                  </h2>
                  <p className="mt-5 text-sm md:text-base text-gray-300/90 max-w-xl">
                    Weddings, editorials, campaigns, or personal portraits —
                    Praveen crafts visuals with cinematic intention, precise lighting,
                    and emotion that lingers. Share your idea and we&apos;ll build the narrative together.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/90">
                    {/* Primary WhatsApp CTA */}
                    <a
                      href="https://wa.me/94766939162"
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 rounded-full
                                 bg-emerald-400 text-black font-semibold
                                 px-6 py-3
                                 shadow-[0_18px_55px_rgba(16,185,129,0.45)]
                                 transition-all duration-300
                                 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(16,185,129,0.7)]"
                    >
                      <span className="h-2 w-2 rounded-full bg-black/80" />
                      WhatsApp +94 76 693 9162
                      <span className="text-xs">↗</span>
                    </a>

                    {/* Email CTA */}
                    <a
                      href="mailto:praveenshamal0000@gmail.com"
                      className="group inline-flex items-center gap-3 rounded-full
                                 border border-white/22 bg-white/5
                                 px-5 py-3 text-xs md:text-sm text-white/90
                                 transition-all duration-300
                                 hover:border-purple-400 hover:bg-purple-500/10 hover:-translate-y-0.5"
                    >
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      praveenshamal0000@gmail.com
                    </a>
                  </div>
                </div>

                {/* Right: Socials + info */}
                <div className="space-y-5">
                  {/* Social links with icons */}
                  <div className="rounded-3xl border border-white/14 bg-white/3 px-5 py-4 backdrop-blur-xl">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                      Social presence
                    </p>
                    <div className="mt-3 flex flex-col gap-2.5">
                      {socialLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center justify-between gap-3
                                     text-xs md:text-sm text-gray-200/90
                                     transition-all duration-300 hover:text-emerald-300"
                        >
                          <div className="inline-flex items-center gap-2.5">
                            <span
                              className="flex h-7 w-7 items-center justify-center rounded-full
                                         bg-white/5 border border-white/15
                                         text-emerald-300 transition-all duration-300
                                         group-hover:bg-emerald-400/15 group-hover:border-emerald-300/70"
                            >
                              <SocialIcon label={link.label} />
                            </span>
                            <span>{link.label}</span>
                          </div>
                          <span
                            className="h-px w-7 bg-white/14 transition-all duration-300
                                       group-hover:w-11 group-hover:bg-emerald-300"
                          />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Micro note card */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="rounded-3xl border border-emerald-400/25 bg-black/80 px-5 py-4
                               flex flex-col gap-1.5 text-xs text-gray-200/90"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="uppercase tracking-[0.22em] text-[8px] text-emerald-300">
                        Priority projects
                      </p>
                    </div>
                    <p>
                      For brand campaigns &amp; multi-day productions, include dates,
                      locations, and mood references. You get a tailored reply, not a template.
                    </p>
                  </motion.div>


                </div>
              </div>
            </motion.div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
