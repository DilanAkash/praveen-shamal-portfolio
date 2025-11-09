import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { projectOperations, isAdminConfigured } from "../../lib/sanityAdmin";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  category: string;
  description?: string;
  image?: {
    asset: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectOperations.getAll();
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await projectOperations.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const getImageUrl = (image: Project["image"]) => {
    if (!image?.asset) return null;
    // Use direct URL with Sanity image API parameters for optimization
    if (image.asset.url) {
      return `${image.asset.url}?w=400&h=300&fit=crop&auto=format`;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAdminConfigured) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Admin Panel Not Configured</h2>
            <p className="text-gray-300 mb-4">
              Please set the <code className="bg-black/50 px-2 py-1 rounded">VITE_SANITY_WRITE_TOKEN</code> environment
              variable to enable write operations.
            </p>
            <p className="text-sm text-gray-400">
              You can get your write token from{" "}
              <a
                href="https://sanity.io/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Sanity Management Console
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Manage your portfolio projects</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/new")}
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                + Add Project
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/admin/login");
                }}
                className="px-4 py-2 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-400">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={loadProjects}
              className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No projects yet</p>
            <button
              onClick={() => navigate("/admin/new")}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {projects.length} {projects.length === 1 ? "Project" : "Projects"}
              </h2>
              <button
                onClick={loadProjects}
                className="px-4 py-2 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-900 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors"
                  >
                    {/* Image */}
                    {project.image && (
                      <div className="aspect-video bg-gray-800 overflow-hidden">
                        <img
                          src={getImageUrl(project.image) || ""}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
                        <span className="px-2 py-1 bg-gray-800 text-xs rounded capitalize">
                          {project.category}
                        </span>
                      </div>

                      {project.description && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                          {project.description}
                        </p>
                      )}

                      <div className="text-xs text-gray-500 mb-4">
                        Created: {formatDate(project._createdAt)}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/edit/${project._id}`)}
                          className="flex-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(project._id)}
                          className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-sm text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-white/10"
            >
              <h3 className="text-xl font-bold mb-2">Delete Project?</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

