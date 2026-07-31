import type { NextConfig } from "next";

// Next 16 does not run ESLint during `next build`; linting is a dedicated gate
// (`pnpm lint`). TypeScript errors still fail the build by default.
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
