import { useEffect, useState, useMemo, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import { client, urlFor } from "../../lib/sanity";
import { motion, AnimatePresence } from "framer-motion";

interface SanityImageItem {
  _id: string;
  title?: string;
  category?: string;
  description?: string;
  image?: unknown;
  gallery?: unknown[];
  _createdAt: string;
  lqip?: string;
}

interface ImageItem {
  id: string;
  title: string;
  description?: string;
  src: string;
  fullSrc: string;
  thumbnailSrc: string;
  alt: string;
  category: string;
  createdAt: string;
  lqip?: string;
}

interface CategoryInfo {
  name: string;
  label: string;
  count: number;
  color: string;
}

const CATEGORIES: CategoryInfo[] = [
  { name: "All", label: "All Work", count: 0, color: "bg-white text-black" },
  { name: "wedding", label: "Wedding", count: 0, color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  { name: "portrait", label: "Portrait", count: 0, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { name: "commercial", label: "Commercial", count: 0, color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { name: "retouch", label: "Retouch", count: 0, color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { name: "album", label: "Albums", count: 0, color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
];

type SortOption = "newest" | "oldest" | "category";

// Loading skeleton component
function GallerySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="break-inside-avoid rounded-xl overflow-hidden bg-gray-900/50 animate-pulse"
          style={{ height: `${200 + Math.random() * 200}px` }}
        >
          <div className="w-full h-full bg-gray-800/50" />
        </div>
      ))}
    </div>
  );
}

// Image card component
function ImageCard({
  item,
  index,
  onClick,
}: {
  item: ImageItem;
  index: number;
  onClick: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const categoryInfo = CATEGORIES.find((cat) => cat.name === item.category) || CATEGORIES[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="relative break-inside-avoid mb-4 cursor-pointer group overflow-hidden rounded-xl bg-gray-900/30"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Image container */}
      <div className="relative aspect-auto overflow-hidden rounded-xl">
        {/* Blur placeholder */}
        {!imageLoaded && item.lqip && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-50"
            style={{ backgroundImage: `url(${item.lqip})` }}
          />
        )}

        {/* Main image */}
        <motion.img
          src={item.thumbnailSrc}
          alt={item.alt}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-110`}
          style={{ filter: imageLoaded ? "none" : "blur(20px)" }}
        />

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Content overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col justify-end p-4 text-white pointer-events-none"
            >
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-2 w-fit border ${
                  categoryInfo.color
                }`}
              >
                {categoryInfo.label}
              </motion.div>

              {/* Title */}
              {item.title && (
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg font-bold mb-1 line-clamp-2"
                >
                  {item.title}
                </motion.h3>
              )}

              {/* Description */}
              {item.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-300 line-clamp-2"
                >
                  {item.description}
                </motion.p>
              )}

              {/* View indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-3 text-xs text-gray-400 flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Click to view
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function MasonryGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSticky, setFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch images from Sanity
  useEffect(() => {
    setLoading(true);
    setError(null);

    client
      .fetch<SanityImageItem[]>(
        `*[_type == "project" && defined(image.asset)] | order(_createdAt desc){
          _id,
          title,
          category,
          description,
          image,
          _createdAt,
          "lqip": image.asset->metadata.lqip
        }`
      )
      .then((data) => {
        const formatted: ImageItem[] = data
          .map((item) => {
            try {
              const source = item.image as Record<string, unknown>;

              // Generate optimized image URLs
              const thumbnailSrc = urlFor(source)
                .width(600)
                .height(800)
                .fit("max")
                .format("webp")
                .quality(75)
                .url();

              const src = urlFor(source)
                .width(1200)
                .height(1600)
                .fit("max")
                .format("webp")
                .quality(85)
                .url();

              const fullSrc = urlFor(source)
                .width(2400)
                .format("webp")
                .quality(92)
                .url();

              return {
                id: item._id,
                title: item.title || "Untitled",
                description: item.description,
                src,
                fullSrc,
                thumbnailSrc,
                alt: item.title || "Portfolio image",
                category: item.category || "uncategorized",
                createdAt: item._createdAt,
                lqip: item.lqip,
              } as ImageItem;
            } catch (err) {
              console.error("Error processing image:", err);
              return null;
            }
          })
          .filter((item): item is ImageItem => item !== null);

        setImages(formatted);
        setFilteredImages(formatted);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
        setError(err?.message || "Failed to load portfolio images");
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    images.forEach((img) => {
      counts[img.category] = (counts[img.category] || 0) + 1;
      counts["All"] = (counts["All"] || 0) + 1;
    });
    return counts;
  }, [images]);

  // Update filtered images based on category and sort
  useEffect(() => {
    let filtered = [...images];

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((img) => img.category === activeCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "category":
          return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredImages(filtered);
  }, [images, activeCategory, sortBy]);

  // Sticky filter bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setFilterSticky(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle filter change
  const handleFilter = (category: string) => {
    setActiveCategory(category);
    // Smooth scroll to gallery on mobile
    if (window.innerWidth < 768) {
      const gallerySection = document.getElementById("gallery");
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-12 bg-gray-900/50 rounded-lg animate-pulse mb-4" />
          <div className="h-10 bg-gray-900/50 rounded-lg animate-pulse w-32" />
        </div>
        <GallerySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg font-semibold mb-2">Error loading gallery</div>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No portfolio images yet</div>
        <p className="text-gray-500 text-sm">Check back soon for new work!</p>
      </div>
    );
  }

  const lightboxSlides = filteredImages.map((img) => ({
    src: img.fullSrc,
    alt: img.alt,
    title: img.title,
    description: img.description,
  }));

  return (
    <div className="w-full">
      {/* Filter and Sort Controls */}
      <div
        ref={filterRef}
        className={`mb-8 transition-all duration-300 ${
          filterSticky
            ? "sticky top-16 z-40 bg-black/95 backdrop-blur-md py-4 -mx-4 px-4 rounded-lg border-b border-white/10"
            : ""
        }`}
      >
        {/* Category Filters */}
        <div className="mb-4 -mx-2 px-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.filter((cat) => cat.name === "All" || categoryCounts[cat.name] > 0).map(
              (category) => {
                const count = categoryCounts[category.name] || 0;
                const isActive = activeCategory === category.name;

                return (
                  <motion.button
                    key={category.name}
                    onClick={() => handleFilter(category.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                      isActive
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-transparent text-white/70 border-white/20 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="flex items-center gap-2">
                      {category.label}
                      {count > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs ${
                            isActive
                              ? "bg-black/20 text-black"
                              : "bg-white/20 text-white/70"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </span>
                  </motion.button>
                );
              }
            )}
          </div>
        </div>

        {/* Sort and Results Count */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-400">
            Showing <span className="text-white font-semibold">{filteredImages.length}</span>{" "}
            {filteredImages.length === 1 ? "image" : "images"}
            {activeCategory !== "All" && ` in ${CATEGORIES.find((c) => c.name === activeCategory)?.label}`}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 bg-gray-900/50 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="category">By Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No images in this category</div>
          <button
            onClick={() => setActiveCategory("All")}
            className="text-white underline hover:text-gray-300"
          >
            View all work
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((item, index) => (
              <ImageCard
                key={item.id}
                item={item}
                index={index}
                onClick={() => setLightboxIndex(index)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Enhanced Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        slides={lightboxSlides}
        plugins={[Zoom, Fullscreen, Captions]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        carousel={{
          finite: false,
          preload: 2,
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.96)" },
          captionsTitle: { color: "white", fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" },
          captionsDescription: { color: "rgba(255, 255, 255, 0.85)", fontSize: "0.9375rem", lineHeight: "1.5" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
}
