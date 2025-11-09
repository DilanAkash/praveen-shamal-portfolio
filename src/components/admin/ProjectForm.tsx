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
        {/* subtle bg */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,253,0.14),transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),transparent_60%)]" />
        <div className="text-center relative">
          <div className="inline-block animate-spin rounded-full h-9 w-9 border-b-2 border-white mb-4" />
          <p className="text-gray-400 text-sm tracking-wide">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradients / glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),transparent_65%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),transparent_65%)]" />
      <div className="pointer-events-none absolute -top-24 right-[-40px] h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-1"
          >
            <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Portfolio Control Center
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              {isEditMode ? "Edit Project" : "Add New Project"}
            </h1>
            <p className="text-xs md:text-sm text-gray-400">
              Curate, update, and publish your best work with a clear, fast panel.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs md:text-sm
                       bg-white/5 border border-white/15 text-gray-300
                       hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="text-xs">←</span>
            Back to admin
          </motion.button>
        </div>
      </header>

      {/* Form + Preview */}
      <main className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,1.2fr)] items-start"
        >
          {/* Left column: fields */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-300 tracking-wide"
              >
                Project Title <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm
                             text-white placeholder-gray-500 outline-none transition-all
                             focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70
                             group-hover:border-white/20"
                  placeholder="E.g. Amal & Nethmi — Sunset Wedding Story"
                  required
                />
                <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-r from-white/3 via-transparent to-white/3 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              </div>
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
                  className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm
                             text-white outline-none appearance-none
                             focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
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
                className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm
                           text-white placeholder-gray-500 outline-none resize-none
                           focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70"
                placeholder="Short story, concept, or details about this project (optional)."
              />
              <p className="text-[10px] text-gray-500">
                Keep it concise. This will help clients understand the narrative behind the work.
              </p>
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
                className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm
                           text-white placeholder-gray-500 outline-none
                           focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70"
                placeholder="Lower = appears earlier (optional)"
              />
              <p className="text-[10px] text-gray-500">
                Leave empty to sort by created date. Use this for hero / featured ordering control.
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
                className="px-4 py-3 rounded-2xl text-xs md:text-sm
                           bg-white/5 border border-white/12 text-gray-300
                           hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={loading || !formData.title}
                whileHover={
                  !(loading || !formData.title) ? { scale: 1.02 } : {}
                }
                whileTap={
                  !(loading || !formData.title) ? { scale: 0.97 } : {}
                }
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3
                           rounded-2xl text-xs md:text-sm font-semibold tracking-wide
                           bg-gradient-to-r from-white via-slate-100 to-slate-300
                           text-black shadow-[0_16px_40px_rgba(0,0,0,0.8)]
                           hover:shadow-[0_20px_55px_rgba(0,0,0,0.9)]
                           transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  <>
                    <span>Save Changes</span>
                    <span className="text-[10px]">↻</span>
                  </>
                ) : (
                  <>
                    <span>Create Project</span>
                    <span className="text-[10px]">➜</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Right column: preview & toggles */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="space-y-4"
          >
            {/* Live Preview Card */}
            <div className="relative backdrop-blur-2xl bg-white/3 border border-white/10 rounded-3xl p-4 md:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-[0.18em] text-gray-400">
                    Live Preview
                  </span>
                  <span className="text-xs text-gray-500">
                    How this entry feels in your grid
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[9px] border ${
                    formData.published
                      ? "bg-emerald-400/10 border-emerald-400/40 text-emerald-300"
                      : "bg-gray-500/5 border-gray-500/40 text-gray-400"
                  }`}
                >
                  {formData.published ? "Visible" : "Hidden"}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                <div className="h-40 bg-gradient-to-b from-white/5 to-black/80 flex items-center justify-center">
                  {preview || formData.existingImageUrl ? (
                    <img
                      src={preview || formData.existingImageUrl}
                      alt="Preview"
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[10px] text-gray-500">
                      <div className="h-7 w-7 rounded-lg border border-dashed border-gray-600 flex items-center justify-center text-[14px]">
                        +
                      </div>
                      <span>Project cover preview</span>
                      <span className="text-[9px] text-gray-600">
                        Upload an image to visualize
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-3.5 py-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium text-white truncate">
                      {formData.title || "Untitled project"}
                    </p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                      {
                        CATEGORIES.find(
                          (c) => c.value === formData.category
                        )?.label || "Select category"
                      }
                    </span>
                  </div>
                  <p className="text-[9px] leading-relaxed text-gray-400 line-clamp-2">
                    {formData.description ||
                      "Add a short description to showcase the story, mood, or client brief."}
                  </p>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-4 md:p-5 space-y-2.5">
              <label
                htmlFor="image"
                className="block text-xs font-medium text-gray-300 tracking-wide mb-1"
              >
                Project Cover Image{" "}
                {!isEditMode && <span className="text-red-400">*</span>}
              </label>
              <div className="relative">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-[10px] file:text-[10px]
                             px-3 py-3 bg-black/40 border border-dashed border-white/18
                             rounded-2xl text-gray-300
                             file:mr-3 file:py-1.5 file:px-3
                             file:rounded-xl file:border-0
                             file:bg-white file:text-black
                             hover:file:bg-gray-200
                             focus:outline-none focus:ring-2 focus:ring-indigo-400/70"
                  required={!isEditMode}
                />
              </div>
              <p className="text-[9px] text-gray-500">
                Use high-quality JPG/PNG. Recommended horizontal images for smooth grid layouts.
                {isEditMode
                  ? " Leave empty to keep the current image."
                  : ""}
              </p>
            </div>

            {/* Published toggle */}
            <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-4 md:p-5 flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-gray-200">
                  Published status
                </span>
                <span className="text-[9px] text-gray-500">
                  Toggle visibility without deleting the project.
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.published
                    ? "bg-emerald-400/80"
                    : "bg-gray-600/60"
                }`}
              >
                <span
                  className={`inline-block h-4.5 w-4.5 rounded-full bg-black shadow-md transform transition-transform ${
                    formData.published
                      ? "translate-x-5"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </motion.form>
      </main>
    </div>
  );
}
