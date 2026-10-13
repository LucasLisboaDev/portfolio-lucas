/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@elevenlabs/client"],
  images: {
    // AVIF first: about 30 to 50% smaller than WebP for the portrait photos.
    // Browsers without AVIF support still get WebP.
    formats: ["image/avif", "image/webp"],
  },
  webpack(config) {
    // "motion/react" (motion 14.1) re-exports framer-motion and then reads
    // `fm.motion` at the top level of the module. That one line marks the full
    // `motion` component as used, so webpack bundles all of Motion's features
    // (layout, drag, gestures) into the first page load, even though the site
    // only uses the lightweight `m` components and loads the features later
    // through LazyMotion (see components/motion/MotionProvider.tsx).
    //
    // Pointing "motion/react" at framer-motion, the package motion itself
    // re-exports at the same pinned version, gives the identical API with
    // proper tree shaking, so the feature bundle really does load
    // asynchronously. Safe to remove once motion's entry stops doing this.
    config.resolve.alias = {
      ...config.resolve.alias,
      "motion/react$": "framer-motion",
    };
    return config;
  },
};

module.exports = nextConfig;
