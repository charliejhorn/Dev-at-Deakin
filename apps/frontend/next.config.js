/** @type {import('next').NextConfig} */
const path = require("path");

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
    // only set outputFileTracingRoot in development to avoid affecting production builds
    ...(process.env.NODE_ENV === "development"
        ? { outputFileTracingRoot: "/" }
        : {}),
    sassOptions: {
        // add sass options here, eg:
        // additionalData: '$var: red;'

        // allow importing from these directories without long relative paths
        includePaths: [
            path.join(process.cwd(), "styles"),
            path.join(process.cwd(), "node_modules"),
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
