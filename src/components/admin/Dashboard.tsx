import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { projectOperations, isAdminConfigured } from "../../lib/sanityAdmin";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Project {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  category: string;
  description?: string;
  published?: boolean;
  order?: number;
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

interface ActivityLog {
  id: string;
  action: string;
  projectTitle: string;
  timestamp: Date;
  type: "create" | "update" | "delete" | "publish" | "unpublish" | "reorder";
}

// Sortable Project Card Component
function SortableProjectCard({
  project,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onTogglePublish,
  getImageUrl,
  formatDate,
}: {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, published: boolean) => void;
  getImageUrl: (image: Project["image"]) => string | null;
  formatDate: (date: string) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-900 rounded-lg overflow-hidden border transition-all relative ${
        isSelected
          ? "border-white/50 ring-2 ring-white/20"
          : "border-white/10 hover:border-white/20"
      } ${isDragging ? "cursor-grabbing opacity-50" : "cursor-move"}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-2 bg-black/70 rounded cursor-grab active:cursor-grabbing hover:bg-black/90 transition-colors touch-none"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>

      {/* Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(project._id)}
          className="w-5 h-5 rounded border-white/20 bg-gray-800 text-white focus:ring-2 focus:ring-white/50"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Image */}
      {project.image && (
        <div className="aspect-video bg-gray-800 overflow-hidden relative">
          <img
            src={getImageUrl(project.image) || ""}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {!project.published && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500/80 text-black text-xs font-semibold rounded">
              Draft
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 pr-2">{project.title}</h3>
          <span className="px-2 py-1 bg-gray-800 text-xs rounded capitalize whitespace-nowrap">
            {project.category}
          </span>
        </div>

        {project.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Created: {formatDate(project._createdAt)}</span>
          {project.order !== undefined && (
            <span className="px-2 py-0.5 bg-gray-800 rounded">Order: {project.order}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project._id)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onTogglePublish(project._id, !project.published)}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              project.published
                ? "bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                : "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
            }`}
            title={project.published ? "Unpublish" : "Publish"}
          >
            {project.published ? "✓" : "○"}
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-sm text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [showDrafts, setShowDrafts] = useState(true);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDrafts]);

  useEffect(() => {
    loadActivityLog();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectOperations.getAll(showDrafts);
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLog = () => {
    const logs = localStorage.getItem("activityLog");
    if (logs) {
      try {
        const parsed = JSON.parse(logs).map((log: ActivityLog) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setActivityLog(parsed.slice(-50)); // Keep last 50 activities
      } catch {
        setActivityLog([]);
      }
    }
  };

  const addActivityLog = (action: string, projectTitle: string, type: ActivityLog["type"]) => {
    const log: ActivityLog = {
      id: Date.now().toString(),
      action,
      projectTitle,
      timestamp: new Date(),
      type,
    };
    const updated = [log, ...activityLog].slice(0, 50);
    setActivityLog(updated);
    localStorage.setItem("activityLog", JSON.stringify(updated));
  };

  const handleDelete = async (id: string) => {
    try {
      const project = projects.find((p) => p._id === id);
      await projectOperations.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
      setDeleteConfirm(null);
      if (project) {
        addActivityLog(`Deleted project "${project.title}"`, project.title, "delete");
      }
      loadProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedProjects.size} project(s)?`)) {
      return;
    }

    try {
      const ids = Array.from(selectedProjects);
      const deletedProjects = projects.filter((p) => ids.includes(p._id));
      await projectOperations.bulkDelete(ids);
      setProjects(projects.filter((p) => !ids.includes(p._id)));
      setSelectedProjects(new Set());
      deletedProjects.forEach((p) => {
        addActivityLog(`Deleted project "${p.title}"`, p.title, "delete");
      });
      loadProjects();
    } catch (err) {
      console.error("Error deleting projects:", err);
      alert(err instanceof Error ? err.message : "Failed to delete projects");
    }
  };

  const handleBulkPublish = async (published: boolean) => {
    if (selectedProjects.size === 0) return;

    try {
      const ids = Array.from(selectedProjects);
      const updatedProjects = projects.filter((p) => ids.includes(p._id));
      await projectOperations.bulkPublish(ids, published);
      setProjects(
        projects.map((p) => (ids.includes(p._id) ? { ...p, published } : p))
      );
      setSelectedProjects(new Set());
      updatedProjects.forEach((p) => {
        addActivityLog(
          `${published ? "Published" : "Unpublished"} project "${p.title}"`,
          p.title,
          published ? "publish" : "unpublish"
        );
      });
      loadProjects();
    } catch (err) {
      console.error("Error updating projects:", err);
      alert(err instanceof Error ? err.message : "Failed to update projects");
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const project = projects.find((p) => p._id === id);
      await projectOperations.update(id, { published });
      setProjects(projects.map((p) => (p._id === id ? { ...p, published } : p)));
      if (project) {
        addActivityLog(
          `${published ? "Published" : "Unpublished"} project "${project.title}"`,
          project.title,
          published ? "publish" : "unpublish"
        );
      }
      loadProjects();
    } catch (err) {
      console.error("Error updating project:", err);
      alert(err instanceof Error ? err.message : "Failed to update project");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p._id === active.id);
      const newIndex = projects.findIndex((p) => p._id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      // Update order in Sanity
      const updates = newProjects.map((project, index) => ({
        id: project._id,
        order: index,
      }));

      try {
        await projectOperations.bulkUpdateOrder(updates);
        addActivityLog("Reordered gallery", "Multiple projects", "reorder");
        loadProjects();
      } catch (err) {
        console.error("Error updating order:", err);
        alert(err instanceof Error ? err.message : "Failed to update order");
        loadProjects(); // Revert on error
      }
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProjects(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map((p) => p._id)));
    }
  };

  const getImageUrl = (image: Project["image"]) => {
    if (!image?.asset) return null;
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
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
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
        {/* Filters and Bulk Actions */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDrafts}
                onChange={(e) => setShowDrafts(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-gray-800 text-white"
              />
              <span className="text-sm">Show Drafts</span>
            </label>
            <button
              onClick={handleSelectAll}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {selectedProjects.size === projects.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          {selectedProjects.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {selectedProjects.size} selected
              </span>
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-3 py-1.5 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
              >
                Unpublish
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((p) => p._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {projects.map((project) => (
                    <SortableProjectCard
                      key={project._id}
                      project={project}
                      isSelected={selectedProjects.has(project._id)}
                      onSelect={handleSelect}
                      onEdit={(id) => navigate(`/admin/edit/${id}`)}
                      onDelete={setDeleteConfirm}
                      onTogglePublish={handleTogglePublish}
                      getImageUrl={getImageUrl}
                      formatDate={formatDate}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Activity Log */}
        {activityLog.length > 0 && (
          <div className="mt-12 bg-gray-900/50 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activityLog.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-white/5"
                >
                  <span className="text-gray-300">{log.action}</span>
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
