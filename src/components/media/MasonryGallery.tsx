import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { client, urlFor } from "../../lib/sanity";
import { motion, AnimatePresence } from "framer-motion";

interface SanityImageItem {
  _id: string;
  title?: string;
  category?: string;
  image?: unknown;
  lqip?: string;
}

interface ImageItem {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
  category?: string;
  lqip?: string;
}

const categories = ["All", "wedding", "portrait", "commercial", "retouch"];

export default function MasonryGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [filtered, setFiltered] = useState<ImageItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // keep UI minimal and focused on images

  useEffect(() => {
    client
      .fetch<SanityImageItem[]>(`*[_type == "project" && defined(image.asset)] | order(_createdAt desc){
        _id,
        title,
        category,
        image,
        "lqip": image.asset->metadata.lqip
      }`)
      .then((data) => {
const formatted = data
  .map((item) => {
    try {
      // Explicitly tell TS this is a Sanity image asset reference
      const source = item.image as Record<string, unknown>;

      const src = urlFor(source).width(900).format("webp").quality(80).url();
      const fullSrc = urlFor(source).width(1800).format("webp").quality(90).url();

      return {
        id: item._id,
        src,
        fullSrc,
        alt: item.title || "Portfolio image",
        category: item.category || "uncategorized",
        lqip: item.lqip,
      } as ImageItem;
    } catch {
      return null;
    }
  })
  .filter((item): item is ImageItem => item !== null);

        setImages(formatted);
        setFiltered(formatted);
      })
      .catch((e) => setError(e?.message || "Failed to load images"))
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  const handleFilter = (category: string) => {
    setActiveCategory(category);
    if (category === "All") setFiltered(images);
    else setFiltered(images.filter((img) => img.category === category));
  };

  // counts removed for a cleaner UI

  if (loading) {
    return <p className="text-center text-warmgray">Loading portfolio images...</p>;
  }

  if (!loading && error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  if (!loading && !images.length) {
    return <p className="text-center text-warmgray">No images found yet.</p>;
  }

  return (
    <>
      {/* Simple filter bar (mobile scrollable) */}
      <div className="mb-6 -mx-2 overflow-x-auto pb-1">
        <div className="px-2 flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors duration-200 border 
                ${
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/80 border-white/20 hover:bg-white/10"
                }`}
              aria-pressed={activeCategory === cat}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID */}
<div className={`columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4`}>
  <AnimatePresence>
    {filtered.map((img, i) => (
      <motion.div
        key={img.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="relative break-inside-avoid cursor-pointer group overflow-hidden rounded-xl"
        onClick={() => setIndex(i)}
      >
        {/* Image */}
        <motion.img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-90"
        />

        {/* Floating caption overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white text-sm font-medium"
        >
          <p className="opacity-90">{img.alt}</p>
        </motion.div>
      </motion.div>
    ))}
  </AnimatePresence>
</div>


      {/* LIGHTBOX */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={filtered.map((img) => ({ src: img.fullSrc, alt: img.alt }))}
        plugins={[Zoom, Fullscreen]}
      />
    </>
  );
}

// Keeping the component minimal for better focus on photography
