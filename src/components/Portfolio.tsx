import { motion } from "framer-motion";
import { useLenis } from "../hooks/useLenis";

import Header from "./common/Header";
import Footer from "./common/Footer";
import Container from "./common/Container";
import Section from "./common/Section";
import MasonryGallery from "./media/MasonryGallery";
import Hero from "./sections/Hero";

export default function Portfolio() {
  // enable smooth scroll
  useLenis();

  return (
    <>
      <Header />

      <main className="relative bg-black text-white overflow-hidden">
        {/* HERO SECTION */}
        <Hero />

        {/* ABOUT / INTRO SECTION */}
        <Section>
          <Container>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold mb-4"
              id="about"
            >
              Capturing Timeless Stories
            </motion.h2>

            <p className="text-gray-400 mb-6 max-w-2xl">
              Praveen Shamal specializes in cinematic photography — blending
              emotion, light, and storytelling. From weddings and portraits to
              commercial and retouching projects, every frame reflects artistry
              and attention to detail.
            </p>
          </Container>
        </Section>

        {/* PORTFOLIO GALLERY SECTION */}
        <Section id="gallery">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 md:mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 px-4">
                Portfolio Highlights
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
                Explore a curated selection of work across different genres and styles
              </p>
            </motion.div>
            <MasonryGallery />
          </Container>
        </Section>

        {/* FILLER SCROLL TEST / CONTACT CTA */}
        <Section className="h-[80vh] flex flex-col items-center justify-center text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-xl text-gray-400"
          >
            Ready to create something beautiful?
          </motion.h2>

          <motion.a
            id="contact"
            href="#contact"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            Book a Session
          </motion.a>
        </Section>
      </main>

      <Footer />
    </>
  );
}

