/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SERP_API_KEY: process.env.SERP_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
}

module.exports = nextConfig