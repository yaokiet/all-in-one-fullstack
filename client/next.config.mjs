/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/, // Check for .svg files
      use: ["@svgr/webpack"], // Use the SVGR loader
    });

    return config; // Return the modified configuration
  },
};

export default nextConfig;
