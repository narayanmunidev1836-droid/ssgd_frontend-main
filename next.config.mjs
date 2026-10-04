/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRA had React.StrictMode disabled (commented out in src/index.js) — keep parity
  // so effects don't double-run and behavior matches the old build exactly.
  reactStrictMode: false,
  // CRA served URLs without trailing slashes; Next default matches.
  trailingSlash: false,
  // NOTE (Phase 2 SPIKE-A): image static-import handling is decided by the spike.
  // If `import img from './x.webp'` returns StaticImageData (object), either enable
  // disableStaticImages + an asset rule below, or codemod imports to `img.src`.
  // images: { disableStaticImages: true },
};

export default nextConfig;
