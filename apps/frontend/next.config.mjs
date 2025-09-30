/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        // prefer NEXT_PUBLIC_API_BASE for all frontend fetches
        NEXT_PUBLIC_API_BASE:
            process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000",
    },
    webpack: (config) => {
        // customize webpack configuration here
        return config;
    },
    outputFileTracingRoot: "/",
};

export default nextConfig;
