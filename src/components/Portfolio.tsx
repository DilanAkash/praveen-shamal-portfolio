import { motion, useScroll, useTransform, type Easing, type Variants } from "framer-motion";
import { useRef } from "react";

import { useLenis } from "../hooks/useLenis";

import Header from "./common/Header";
import Footer from "./common/Footer";
import Container from "./common/Container";
import Section from "./common/Section";
import MasonryGallery from "./media/MasonryGallery";
import Hero from "./sections/Hero";

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

export default function Portfolio() {
  // enable smooth scroll
  useLenis();

  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const glowTranslate = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-black via-[#05070d] to-[#070b12] text-white">
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

        {/* HERO SECTION */}
        <Hero />

        {/* ABOUT / INTRO SECTION */}
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
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Meet the storyteller</p>
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
                  Based in Sri Lanka, Praveen is an award-winning visual artist known for cinematic compositions that feel like fragments of an untold film.
                </motion.span>{" "}
                <motion.span variants={textItem}>
                  His work merges carefully engineered lighting with an instinct for human connection, resulting in frames that resonate long after the shutter closes.
                </motion.span>{" "}
                <motion.span variants={textItem}>
                  Whether documenting once-in-a-lifetime celebrations or crafting editorial stories for brands, Praveen crafts experiences where every detail is choreographed to perfection.
                </motion.span>
              </motion.p>
            </motion.div>

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
                  <h3 className="text-2xl font-semibold text-white">{highlight.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">{highlight.description}</p>
                </motion.article>
              ))}
            </motion.div>
          </Container>
        </Section>

        {/* EXPERIENCE TIMELINE SECTION */}
        <Section className="py-24 md:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="mx-auto mb-16 max-w-3xl text-center"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-purple-400">Origins & evolution</p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">A reel of milestones</h2>
              <p className="mt-6 text-gray-400">
                From documentary beginnings to immersive cinematic experiences, every chapter sharpened the craft and elevated the visual language.
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
                      index % 2 === 0 ? "md:ml-0 md:mr-[55%]" : "md:ml-[55%] md:mr-0"
                    }`}
                  >
                    <span className="mb-3 inline-flex items-center rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                      {milestone.year}
                    </span>
                    <h3 className="text-2xl font-semibold text-white">{milestone.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-gray-300">{milestone.description}</p>
                    <div className="absolute -left-1.5 top-6 h-3 w-3 rounded-full border border-purple-400/40 bg-black md:left-auto md:right-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* PORTFOLIO GALLERY SECTION */}
        <Section id="gallery" className="py-24 md:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Selected work</p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">Portfolio Highlights</h2>
              <p className="mt-4 text-base text-gray-400 md:text-lg">
                A curated mix of weddings, editorials, and portrait narratives — crafted with cinematic light, textured color, and honest emotion.
              </p>
            </motion.div>
            <MasonryGallery />
          </Container>
        </Section>

        {/* SERVICES SECTION */}
        <Section className="py-24 md:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="mx-auto mb-16 max-w-3xl text-center"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Crafted experiences</p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">Services designed for impact</h2>
              <p className="mt-6 text-gray-400">
                Each offering is tailored end-to-end — from concept development and mood boards to on-site direction, sound design, and final delivery.
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
                  <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-4 text-sm uppercase tracking-[0.2em] text-emerald-300">{service.tagline}</p>
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

        {/* CONTACT CTA SECTION */}
        <Section id="contact" className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: cinematicEase }}
              className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-emerald-500/15 via-purple-500/10 to-sky-500/15 p-10 md:p-16 backdrop-blur-xl"
            >
              <motion.div
                animate={{ rotate: [0, 4, 0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-32 right-12 h-40 w-40 rounded-full border border-white/20"
              />
              <motion.div
                animate={{ rotate: [0, -3, 0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
                className="pointer-events-none absolute -bottom-40 left-20 h-64 w-64 rounded-full border border-white/10"
              />

              <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Collaborate</p>
                  <h2 className="mt-4 text-3xl font-bold md:text-5xl">
                    Ready to craft your next cinematic chapter?
                  </h2>
                  <p className="mt-6 text-base text-white/80 md:text-lg">
                    Let’s design the visual narrative your story deserves — whether it’s an intimate celebration, an editorial campaign, or a brand experience that lives on every screen.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <a
                      href="https://wa.me/94766939162"
                      className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-5 py-3 backdrop-blur transition duration-300 hover:border-emerald-400 hover:bg-emerald-500/10"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400 transition group-hover:scale-150" />
                      WhatsApp +94 76 693 9162
                    </a>
                    <a
                      href="mailto:hello@praveenkarunarathna.com"
                      className="inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 transition duration-300 hover:border-purple-400 hover:bg-purple-500/10"
                    >
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      praveenshamal0000@gmail.com
                    </a>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">Connect</p>
                    <ul className="mt-4 space-y-3 text-base text-white/80">
                      {socialLinks.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2 transition duration-300 hover:text-emerald-300"
                          >
                            <span className="h-px w-8 bg-white/20 transition-all duration-300 group-hover:w-12 group-hover:bg-emerald-300" />
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <motion.a
                    href="https://wa.me/94766939162"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-center text-base font-semibold text-black shadow-[0_20px_45px_-15px_rgba(255,255,255,0.6)] transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(16,185,129,0.5)]"
                  >
                    Start a WhatsApp chat
                  </motion.a>
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
