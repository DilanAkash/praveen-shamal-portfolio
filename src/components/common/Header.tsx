import Container from "./Container";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-onyx/40 backdrop-blur">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <a href="#hero" className="font-semibold tracking-wide">Praveen Shamal</a>
          <div className="flex gap-6 text-sm">
            <a href="#gallery" className="hover:text-ceylongold transition-colors">Work</a>
            <a href="#about" className="hover:text-ceylongold transition-colors">About</a>
            <a href="#contact" className="hover:text-ceylongold transition-colors">Contact</a>
          </div>
        </nav>
      </Container>
    </header>
  );
}
