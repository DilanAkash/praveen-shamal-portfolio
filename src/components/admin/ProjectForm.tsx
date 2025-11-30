import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectOperations } from "../../lib/sanityAdmin";
import { motion } from "framer-motion";

const CATEGORIES = [
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "commercial", label: "Commercial" },
  { value: "retouch", label: "Editing / Retouch" },
  { value: "album", label: "Albums" },
  { value: "events", label: "Events" },
  { value: "photoshoots", label: "Photoshoots" },
];

interface ProjectData {
  title: string;
  category: string;
  description: string;
  image: File | null;
  existingImageUrl?: string;
  published: boolean;
  order?: number;
}

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProjectData>({
    title: "",
    category: "wedding",
    description: "",
    image: null,
    published: true,
    order: undefined,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(isEditMode);

  // Load existing project data if editing
  useEffect(() => {
    if (isEditMode && id) {
      loadProject(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, id]);

  const loadProject = async (projectId: string) => {
    try {
      setLoadingExisting(true);
      const project = await projectOperations.getById(projectId);

      if (project) {
        setFormData({
          title: project.title || "",
          category: project.category || "wedding",
          description: project.description || "",
          image: null,
          existingImageUrl: project.image?.asset?.url,
          published: project.published ?? true,
          order: project.order,
        });

        if (project.image?.asset?.url) {
          setPreview(project.image.asset.url);
        }
      } else {
        setError("Project not found");
        navigate("/admin");
      }
    } catch (err) {
      console.error("Error loading project:", err);
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditMode && id) {
        await projectOperations.update(id, {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          image: formData.image || undefined,
          published: formData.published,
          order: formData.order,
        });
      } else {
        if (!formData.image) {
          setError("Please select an image");
          setLoading(false);
          return;
        }

        await projectOperations.create({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          image: formData.image,
        });
      }

      navigate("/admin");
    } catch (err) {
      console.error("Error saving project:", err);
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,253,0.16),transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.14),transparent_60%)]" />
        <div className="relative text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4" />
          <p className="text-gray-400 text-sm tracking-wide">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.13),transparent_55%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.10),transparent_60%)]" />

      {/* Top header / toolbar */}
      <header className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Portfolio Admin
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl md:text-2xl font-semibold text-white">
                {isEditMode ? "Edit Project" : "Create New Project"}
              </h1>
              <span className="px-2 py-0.5 text-[9px] rounded-full bg-white/5 border border-white/10 text-gray-300">
                {isEditMode ? "Update existing entry" : "Add to live gallery"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Curate your showcase with high-impact visuals & clean metadata.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            >
              <span className="text-xs">←</span>
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Form container */}
      <main className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="grid md:grid-cols-[minmax(0,2fr)_minmax(260px,1.1fr)] gap-8 items-start"
        >
          {/* Left column - form fields */}
          <section className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-7 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)]">
            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-300 tracking-wide"
              >
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70"
                placeholder="Eg. Summer Wedding at Galle Fort"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-xs font-medium text-gray-300 tracking-wide"
              >
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm text-white outline-none appearance-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70 pr-9"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  ▼
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-xs font-medium text-gray-300 tracking-wide"
              >
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm text-white placeholder-gray-500 outline-none resize-none transition-all focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70"
                placeholder="Short context about the project (location, mood, client type, style)..."
              />
            </div>

            {/* Published toggle */}
            <div className="space-y-2">
              <span className="block text-xs font-medium text-gray-300 tracking-wide">
                Visibility
              </span>
              <div
                className="flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-white">
                    {formData.published ? "Published" : "Draft only"}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {formData.published
                      ? "This project appears live on your portfolio."
                      : "Hidden from visitors until you publish it."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      published: !formData.published,
                    })
                  }
                  className={`relative w-11 h-6 rounded-full transition-all flex items-center px-1 ${
                    formData.published
                      ? "bg-emerald-400/90"
                      : "bg-gray-700/90"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-black/90 shadow-md transform transition-transform ${
                      formData.published ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <label
                htmlFor="order"
                className="block text-xs font-medium text-gray-300 tracking-wide"
              >
                Display Order
              </label>
              <input
                id="order"
                type="number"
                value={formData.order ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                min="0"
                className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70"
                placeholder="Optional — lower numbers show first"
              />
              <p className="text-[10px] text-gray-500">
                Leave empty to sort by created date.
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/40 rounded-2xl text-[11px] text-red-300"
              >
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                {error}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-4 py-3 rounded-2xl text-xs md:text-sm text-gray-300 bg-white/5 border border-white/12 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={
                  loading ||
                  !formData.title ||
                  (!isEditMode && !formData.image)
                }
                whileHover={
                  !(
                    loading ||
                    !formData.title ||
                    (!isEditMode && !formData.image)
                  )
                    ? { scale: 1.02 }
                    : {}
                }
                whileTap={
                  !(
                    loading ||
                    !formData.title ||
                    (!isEditMode && !formData.image)
                  )
                    ? { scale: 0.97 }
                    : {}
                }
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs md:text-sm font-semibold tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-300 text-black shadow-[0_16px_50px_rgba(0,0,0,0.9)] hover:shadow-[0_20px_60px_rgba(0,0,0,1)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  <>
                    <span>Update Project</span>
                    <span className="text-[10px]">↻</span>
                  </>
                ) : (
                  <>
                    <span>Create Project</span>
                    <span className="text-[10px]">＋</span>
                  </>
                )}
              </motion.button>
            </div>
          </section>

          {/* Right column - image preview & info */}
          <section className="space-y-4">
            <div className="bg-white/4 border border-white/10 rounded-3xl p-4 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-[0.18em] text-gray-400">
                    Featured Image
                  </span>
                  <span className="text-xs text-gray-500">
                    Hero visual for this project
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] text-gray-300">
                  {preview || formData.existingImageUrl
                    ? "Preview active"
                    : "Awaiting upload"}
                </span>
              </div>

              {preview || formData.existingImageUrl ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60"
                >
                  <img
                    src={preview || formData.existingImageUrl}
                    alt="Project preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between gap-2">
                    <span className="text-[9px] text-gray-300 truncate">
                      {formData.title || "Untitled project"}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-gray-200">
                      {CATEGORIES.find(
                        (c) => c.value === formData.category
                      )?.label || "Category"}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 rounded-2xl border border-dashed border-white/18 bg-black/50 text-center">
                  <span className="text-2xl mb-1">🖼️</span>
                  <p className="text-[10px] text-gray-400 max-w-[180px]">
                    Upload a strong visual. This will represent the project in
                    your gallery grid.
                  </p>
                </div>
              )}

              <div className="mt-3">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-[10px] file:text-[10px] text-gray-300
                             file:mr-3 file:px-3 file:py-2 file:rounded-xl
                             file:border-0 file:bg-white file:text-black
                             file:font-medium file:cursor-pointer
                             hover:file:bg-gray-200 cursor-pointer
                             bg-transparent"
                  required={!isEditMode}
                />
                <p className="mt-1.5 text-[9px] text-gray-500">
                  {isEditMode
                    ? "Leave empty to keep current image, or upload to replace."
                    : "Recommended: high-resolution, landscape-oriented image."}
                </p>
              </div>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 text-[9px] text-gray-500 backdrop-blur-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live sync with Sanity admin operations
              </div>
              <p>
                Saving will instantly update your portfolio view. Use Draft mode
                to stage changes before going live.
              </p>
            </div>
          </section>
        </motion.form>
      </main>
    </div>
  );
}
