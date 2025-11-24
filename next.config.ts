import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "a0.muscache.com", // Airbnb images
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
