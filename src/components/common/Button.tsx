export default function Button({ children, href }: { children: React.ReactNode; href?: string }) {
  const base =
    "inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium bg-ceylongold text-onyx hover:opacity-90 transition";
  return href ? (
    <a className={base} href={href}>
      {children}
    </a>
  ) : (
    <button className={base}>{children}</button>
  );
}
