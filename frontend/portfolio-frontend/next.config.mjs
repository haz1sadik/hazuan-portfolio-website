/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://10.18.35.157:3000",
    "10.18.35.157",
    '192.168.0.25'
  ],
};



export default nextConfig;
