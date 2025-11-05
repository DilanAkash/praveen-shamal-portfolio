type Props = {
  publicId: string;
  alt: string;
  lqip?: string;
};

export default function ImageLQIP({ publicId, alt, lqip }: Props) {
  const base = `https://res.cloudinary.com/${
    import.meta.env.VITE_CLOUDINARY_CLOUD
  }/image/upload/`;
  const src = `${base}f_auto,q_auto/${publicId}`;
  const placeholder = lqip || `${base}e_blur:2000,q_1/${publicId}`;

  return (
    <img
      src={placeholder}
      data-src={src}
      alt={alt}
      className="w-full h-auto transition-[filter] duration-700 [filter:blur(20px)]"
      onLoad={(e) => {
        const img = e.currentTarget;
        const real = new Image();
        real.src = img.dataset.src!;
        real.onload = () => {
          img.src = real.src;
          img.style.filter = "blur(0)";
        };
      }}
    />
  );
}
