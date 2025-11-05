import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-20">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-warmgray">
            © {new Date().getFullYear()} Praveen Shamal Photography
          </p>
          <a
            className="text-sm underline"
            href="https://wa.me/9477XXXXXXX"
            target="_blank"
          >
            WhatsApp Booking
          </a>
        </div>
      </Container>
    </footer>
  );
}
