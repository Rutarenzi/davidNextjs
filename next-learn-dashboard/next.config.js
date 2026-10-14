const withMDX = require('@next/mdx')();

/**
 *  @type {import('next').NextConfig}
 * */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    typedRoutes: true,
  },
};

module.exports = withMDX(nextConfig);
