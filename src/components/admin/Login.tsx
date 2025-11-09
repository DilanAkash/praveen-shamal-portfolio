import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // tiny delay for smoother UX
    await new Promise((resolve) => setTimeout(resolve, 350));

    const success = login(password);
    if (success) {
      navigate("/admin");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex items-center justify-center px-4">
      {/* Gradient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,253,0.16),transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.16),transparent_60%)]" />

      {/* Floating orbs */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 0.6, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="pointer-events-none absolute -top-24 -right-10 h-64 w-64 rounded-full bg-gradient-to-b from-white/10 to-transparent blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 0.5, y: 10, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gradient-to-t from-cyan-400/15 to-transparent blur-3xl"
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl px-8 pt-7 pb-8 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">

          {/* Top label */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                Secure Admin Portal
              </span>
              <h1 className="text-3xl font-semibold text-white">
                Admin Login
              </h1>
            </div>
            <div className="flex flex-col items-end text-[10px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                protected
              </span>
              <span className="mt-1 text-[9px] text-gray-500">
                v1.0 • private
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Enter the admin passphrase to access the control panel.
            <span className="text-gray-500 ml-1">
              Unauthorized access is monitored.
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-300 tracking-wide"
              >
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-black/40 border border-white/12 rounded-2xl text-sm text-white placeholder-gray-500 outline-none transition-all
                             focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400/70
                             group-hover:border-white/25"
                  placeholder="Enter admin password"
                  required
                  autoFocus
                />
                <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              </div>
            </div>

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

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={!(loading || !password) ? { scale: 1.02 } : {}}
              whileTap={!(loading || !password) ? { scale: 0.98 } : {}}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5
                         rounded-2xl text-sm font-semibold tracking-wide
                         bg-gradient-to-r from-white via-slate-100 to-slate-300
                         text-black shadow-[0_14px_40px_rgba(0,0,0,0.7)]
                         hover:shadow-[0_18px_50px_rgba(0,0,0,0.9)]
                         transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <span>Unlock Admin Panel</span>
                  <span className="text-xs">↗</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 flex items-center justify-between text-[11px] text-gray-500">
  <Link
    to="/"
    className="inline-flex items-center gap-1 hover:text-white/90 transition-colors"
  >
    <span className="text-xs">←</span>
    Back to portfolio
  </Link>
  <span className="text-[9px] text-gray-600">
    Designed by{" "}
    <a
      href="https://dilanakash.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white/90 transition-colors"
    >
      Dilan Akash
    </a>
  </span>
</div>

        </div>
      </motion.div>
    </div>
  );
}
