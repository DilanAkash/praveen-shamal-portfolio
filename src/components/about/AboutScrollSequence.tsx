import { useEffect, useRef, useState, useMemo } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    useSpring,
} from "framer-motion";
import { frameNames } from "./frameData";

const FRAME_COUNT = frameNames.length;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// Helper to generate correct image URLs from our static list
const getFrameUrl = (index: number) => {
    // Safety check
    if (index < 0) index = 0;
    if (index >= frameNames.length) index = frameNames.length - 1;

    return `/pravwithcam/${frameNames[index]}`;
};

export default function AboutScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const loadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
    const requestRef = useRef<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth out the progress for buttery playback
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.001,
    });

    // Map scroll progress 0..1 to Frame Index 0..FRAME_COUNT-1
    const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // --- Preloading Strategy ---
    useEffect(() => {
        let isMounted = true;

        const preloadImages = async () => {
            // Priority 1: Load every 5th frame for quick coarse movement
            for (let i = 0; i < FRAME_COUNT; i += 5) {
                if (!isMounted) return;
                await loadSingleImage(i);
            }

            // Priority 2: Fill in the gaps
            for (let i = 0; i < FRAME_COUNT; i++) {
                if (!isMounted) return;
                if (i % 5 !== 0) await loadSingleImage(i);
            }
        };

        const loadSingleImage = (index: number): Promise<void> => {
            return new Promise((resolve) => {
                if (loadedImagesRef.current.has(index)) {
                    resolve();
                    return;
                }

                const img = new Image();
                img.src = getFrameUrl(index);
                img.onload = () => {
                    if (isMounted) {
                        loadedImagesRef.current.set(index, img);
                        setImagesLoaded((prev) => prev + 1);
                        resolve();
                    }
                };
                img.onerror = (e) => {
                    console.error(`Failed to load frame ${index} at ${img.src}`, e);
                    resolve(); // Skip on error to avoid blocking
                };
            });
        };

        preloadImages();
        return () => {
            isMounted = false;
        };
    }, []);

    // --- Rendering Loop ---
    const renderFrame = useMemo(
        () => (index: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            // Ensure canvas size matches internal resolution
            if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
                canvas.width = CANVAS_WIDTH;
                canvas.height = CANVAS_HEIGHT;
            }

            // Find nearest loaded frame if exact one isn't ready
            let img = loadedImagesRef.current.get(index);
            if (!img) {
                // Fallback search
                for (let i = 0; i < 10; i++) {
                    const up = loadedImagesRef.current.get(index + i);
                    const down = loadedImagesRef.current.get(index - i);
                    if (up) { img = up; break; }
                    if (down) { img = down; break; }
                }
            }

            if (img) {
                // Clear and Draw
                // Use "contain" logic: draw image centered and contained
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                // Calculate aspect ratios
                const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
                const imgRatio = img.width / img.height;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasRatio > imgRatio) {
                    // Canvas is wider than image -> fit by height
                    drawHeight = CANVAS_HEIGHT;
                    drawWidth = img.width * (CANVAS_HEIGHT / img.height);
                    offsetX = (CANVAS_WIDTH - drawWidth) / 2;
                    offsetY = 0;
                } else {
                    // Canvas is taller than image -> fit by width
                    drawWidth = CANVAS_WIDTH;
                    drawHeight = img.height * (CANVAS_WIDTH / img.width);
                    offsetX = 0;
                    offsetY = (CANVAS_HEIGHT - drawHeight) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        },
        []
    );

    // Sync scroll to render
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const frameToDraw = Math.round(latest);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(() => renderFrame(frameToDraw));
    });

    // Initial draw on mount
    useEffect(() => {
        renderFrame(0);
    }, [renderFrame, imagesLoaded]); // Redraw when images load if we are at start

    return (
        <section ref={containerRef} className="relative h-[500vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">

                {/* --- Background Ambient Glow --- */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-emerald-900/10 blur-[120px] rounded-full opacity-50" />
                    <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-[#050505] to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-[#050505] to-transparent z-10" />
                </div>

                {/* --- Canvas Layer --- */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 h-full w-full object-contain z-0 mix-blend-screen opacity-90"
                    style={{ width: "100%", height: "100%" }}
                />

                {/* --- Film Grain Overlay --- */}
                <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
                />

                {/* --- Ultra Heavy Cinematic Vignette --- */}
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_40%,black_90%)]" />
                <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,black_0%,transparent_15%,transparent_85%,black_100%)]" />
                <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,black_0%,transparent_42%,transparent_70%,black_100%)]" />

                {/* --- Text Overlays (Framer Motion) --- */}
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">

                    {/* Phase 1: 0.05 - 0.20 */}
                    <TextOverlay
                        progress={smoothProgress}
                        start={0.05}
                        end={0.20}
                        topLabel="THE VISION"
                        mainTitle="Visual Storyteller"
                        subTitle="Crafting narratives through light and shadow"
                    />

                    {/* Phase 2: 0.25 - 0.40 */}
                    <TextOverlay
                        progress={smoothProgress}
                        start={0.25}
                        end={0.40}
                        topLabel="THE MOMENT"
                        mainTitle="Capturing Spirits"
                        subTitle="Raw emotion, preserved in time"
                    />

                    {/* Phase 3: 0.45 - 0.60 */}
                    <TextOverlay
                        progress={smoothProgress}
                        start={0.45}
                        end={0.60}
                        topLabel="THE FEELING"
                        mainTitle="That Feel Alive"
                        subTitle="Not just seen, but deeply felt"
                    />

                    {/* Phase 4: 0.65 - 0.85 */}
                    <TextOverlay
                        progress={smoothProgress}
                        start={0.65}
                        end={0.85}
                        topLabel="THE CRAFT"
                        mainTitle="Frame by Frame"
                        subTitle="Every pixel tells a story"
                    />

                </div>

                {/* --- Scroll Progress Bar --- */}
                <div className="absolute bottom-10 left-10 md:left-14 z-30 flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Sequence</span>
                    <div className="h-[2px] w-24 bg-white/10 overflow-hidden rounded-full">
                        <motion.div
                            style={{ width: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
                            className="h-full bg-emerald-400"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}

// --- Text Subcomponent ---
const TextOverlay = ({
    progress,
    start,
    end,
    topLabel,
    mainTitle,
    subTitle
}: {
    progress: any;
    start: number;
    end: number;
    topLabel: string;
    mainTitle: string;
    subTitle: string;
}) => {
    // Fade in/out logic
    // opacity maps: 0 -> 1 -> 1 -> 0
    // range: [start-0.05, start, end, end+0.05]
    const opacity = useTransform(
        progress,
        [start - 0.05, start, end, end + 0.05],
        [0, 1, 1, 0]
    );

    // Scale slightly for cinematic feel
    const scale = useTransform(
        progress,
        [start - 0.05, end + 0.05],
        [0.9, 1.1]
    );

    const blur = useTransform(
        progress,
        [start - 0.05, start, end, end + 0.05],
        [10, 0, 0, 10]
    );

    return (
        <motion.div
            style={{ opacity, scale, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
            className="absolute flex flex-col items-center text-center px-4"
        >
            <span className="text-emerald-400 text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-4 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                {topLabel}
            </span>
            <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tight leading-[1]">
                {mainTitle.toUpperCase()}
            </h2>
            <div className="h-1 w-20 bg-emerald-500/50 my-6 rounded-full" />
            <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide max-w-lg">
                {subTitle}
            </p>
        </motion.div>
    );
};
