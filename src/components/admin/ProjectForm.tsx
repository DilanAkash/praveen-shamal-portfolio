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
        // Note: Published defaults to true in create, order is optional
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {isEditMode ? "Edit Project" : "Add New Project"}
              </h1>
              <p className="text-sm text-gray-400">Manage your portfolio project</p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
              placeholder="Enter project description (optional)"
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Image {!isEditMode && <span className="text-red-400">*</span>}
            </label>

            {preview && (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-64 object-cover rounded-lg border border-white/10"
                />
              </div>
            )}

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:cursor-pointer hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              required={!isEditMode}
            />
            <p className="mt-2 text-sm text-gray-400">
              {isEditMode
                ? "Leave empty to keep current image, or upload a new one to replace it"
                : "Upload an image for this project"}
            </p>
          </div>

          {/* Published Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-gray-800 text-white focus:ring-2 focus:ring-white/50"
              />
              <div>
                <span className="block text-sm font-medium text-gray-300">Published</span>
                <span className="text-xs text-gray-400">
                  {formData.published
                    ? "This project will be visible on the website"
                    : "This project will be hidden (draft)"}
                </span>
              </div>
            </label>
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-2">
              Display Order
            </label>
            <input
              id="order"
              type="number"
              value={formData.order ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: e.target.value ? parseInt(e.target.value, 10) : undefined,
                })
              }
              min="0"
              className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Leave empty for default order"
            />
            <p className="mt-2 text-sm text-gray-400">
              Lower numbers appear first. Leave empty to use creation date order.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-6 py-3 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title}
              className="flex-1 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : isEditMode ? "Update Project" : "Create Project"}
            </button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}

