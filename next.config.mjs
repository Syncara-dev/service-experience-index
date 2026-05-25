/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/profiles/bespoke-windows",
        destination: "/profiles/bespoke-windows-dulwich",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
