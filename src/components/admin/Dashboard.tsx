import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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

/** Sortable Project Card — modern UI, same props/behaviour */
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const setMotionNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
    },
    [setNodeRef]
  );

  return (
    <motion.div
      ref={setMotionNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl
        border ${isSelected ? "border-white/30" : "border-white/10"}
        bg-white/[0.06] hover:bg-white/[0.09]
        transition-all shadow-[0_18px_60px_rgba(0,0,0,0.5)]
        ${isDragging ? "cursor-grabbing ring-2 ring-white/20" : "cursor-grab"}`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-2 rounded-xl bg-black/60 border border-white/10 hover:bg-black/80 active:cursor-grabbing"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </div>

      {/* Select checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(project._id)}
          className="w-5 h-5 rounded-md border-white/20 bg-black/60 text-white focus:ring-2 focus:ring-white/50"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Cover */}
      {project.image && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={getImageUrl(project.image) || ""}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {!project.published && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-yellow-400/90 text-black text-[11px] font-semibold">
              Draft
            </div>
          )}
          {/* Subtle top gloss */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base md:text-lg leading-tight line-clamp-1">{project.title}</h3>
          <span className="px-2 py-1 rounded-lg text-[11px] bg-black/50 border border-white/10 capitalize whitespace-nowrap">
            {project.category}
          </span>
        </div>

        {project.description && (
          <p className="text-sm text-gray-300/90 line-clamp-2 mb-3">{project.description}</p>
        )}

        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4">
          <span>Created: {formatDate(project._createdAt)}</span>
          {project.order !== undefined && (
            <span className="px-2 py-0.5 rounded-md bg-black/50 border border-white/10">Order: {project.order}</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onEdit(project._id)}
            className="px-3 py-2 rounded-xl text-sm bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onTogglePublish(project._id, !project.published)}
            title={project.published ? "Unpublish" : "Publish"}
            className={`px-3 py-2 rounded-xl text-sm border transition-colors
              ${project.published
                ? "bg-emerald-400/15 border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/25"
                : "bg-amber-400/15 border-amber-400/50 text-amber-300 hover:bg-amber-400/25"}`}
          >
            {project.published ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="px-3 py-2 rounded-xl text-sm bg-red-400/10 border border-red-400/40 text-red-300 hover:bg-red-400/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
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
  const [query, setQuery] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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
        setActivityLog(parsed.slice(-50));
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
    if (!confirm(`Are you sure you want to delete ${selectedProjects.size} project(s)?`)) return;

    try {
      const ids = Array.from(selectedProjects);
      const deletedProjects = projects.filter((p) => ids.includes(p._id));
      await projectOperations.bulkDelete(ids);
      setProjects(projects.filter((p) => !ids.includes(p._id)));
      setSelectedProjects(new Set());
      deletedProjects.forEach((p) =>
        addActivityLog(`Deleted project "${p.title}"`, p.title, "delete")
      );
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
      setProjects(projects.map((p) => (ids.includes(p._id) ? { ...p, published } : p)));
      setSelectedProjects(new Set());
      updatedProjects.forEach((p) =>
        addActivityLog(
          `${published ? "Published" : "Unpublished"} project "${p.title}"`,
          p.title,
          published ? "publish" : "unpublish"
        )
      );
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

      const updates = newProjects.map((project, index) => ({ id: project._id, order: index }));
      try {
        await projectOperations.bulkUpdateOrder(updates);
        addActivityLog("Reordered gallery", "Multiple projects", "reorder");
        loadProjects();
      } catch (err) {
        console.error("Error updating order:", err);
        alert(err instanceof Error ? err.message : "Failed to update order");
        loadProjects();
      }
    }
  };

  const handleSelect = (id: string) => {
    const next = new Set(selectedProjects);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedProjects(next);
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === projects.length) setSelectedProjects(new Set());
    else setSelectedProjects(new Set(projects.map((p) => p._id)));
  };

  const getImageUrl = (image: Project["image"]) => {
    if (!image?.asset) return null;
    if (image.asset.url) return `${image.asset.url}?w=600&h=340&fit=crop&auto=format`;
    return null;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const hay = `${p.title} ${p.category} ${p.description || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [projects, query]);

  if (!isAdminConfigured) {
    return (
      <div className="min-h-screen bg-black text-white p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,253,0.16),transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.14),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="rounded-2xl border border-red-400/40 bg-red-400/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-2">Admin Panel Not Configured</h2>
            <p className="text-gray-300">
              Set <code className="bg-black/60 px-2 py-1 rounded">VITE_SANITY_WRITE_TOKEN</code> to enable write ops.
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Manage tokens in{" "}
              <a
                href="https://sanity.io/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline-offset-2 hover:underline"
              >
                Sanity Management Console
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.18),transparent_70%),radial-gradient(40%_50%_at_50%_100%,rgba(34,211,238,0.12),transparent_70%)]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-400">Welcome Praveen, Manage your portfolio projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/admin/new")}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-white via-slate-100 to-slate-300 hover:opacity-95 transition-all shadow-[0_14px_40px_rgba(0,0,0,0.6)]"
              >
                + Add Project
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/admin/login");
                }}
                className="px-4 py-2 rounded-xl text-sm bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Controls Row */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  checked={showDrafts}
                  onChange={(e) => setShowDrafts(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/60 text-white"
                />
                <span>Show drafts</span>
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {selectedProjects.size === projects.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Search (client-side filter only) */}
            <div className="relative w-full md:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, category, description…"
                className="w-full rounded-xl bg-white/8 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70 placeholder:text-gray-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                ⌘K
              </span>
            </div>

            {/* Bulk actions */}
            <AnimatePresence>
              {selectedProjects.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-gray-400">{selectedProjects.size} selected</span>
                  <button
                    onClick={() => handleBulkPublish(true)}
                    className="px-3 py-2 rounded-xl text-sm bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/25"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkPublish(false)}
                    className="px-3 py-2 rounded-xl text-sm bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400/25"
                  >
                    Unpublish
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-2 rounded-xl text-sm bg-red-400/15 border border-red-400/40 text-red-300 hover:bg-red-400/25"
                  >
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-9 w-9 border-2 border-white/30 border-t-white" />
            <p className="mt-4 text-gray-400">Loading projects…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/40 bg-red-400/10 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-1">Error</h2>
            <p className="text-gray-200">{error}</p>
            <button
              onClick={loadProjects}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-white via-slate-100 to-slate-300 hover:opacity-95 transition-all"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-3">📭</div>
            <p className="text-gray-400 text-base mb-6">
              {query ? "No results match your search." : "No projects yet."}
            </p>
            {!query && (
              <button
                onClick={() => navigate("/admin/new")}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-white via-slate-100 to-slate-300 hover:opacity-95 transition-all"
              >
                Create your first project
              </button>
            )}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredProjects.map((p) => p._id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence initial={false}>
                  {filteredProjects.map((project) => (
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
          <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <span className="text-[10px] px-2 py-1 rounded-full bg-black/50 border border-white/10 text-gray-300">
                last {Math.min(activityLog.length, 50)} events
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
              {activityLog.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-gray-200">{log.action}</span>
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.7)]"
            >
              <h3 className="text-lg font-semibold mb-2">Delete project?</h3>
              <p className="text-sm text-gray-300 mb-6">
                This action can’t be undone. The project will be permanently removed.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl text-sm bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
