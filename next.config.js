/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Keep prefetched/visited route segments in the client Router Cache longer
    // so navigating back to a page is instant instead of re-fetching its RSC
    // payload. (These are all static dashboard routes, so a long TTL is safe.)
    staleTimes: {
      dynamic: 60, // visited pages stay fresh in-cache for 60s
      static: 300, // prefetched-on-hover links for 5 min
    },
  },
};

module.exports = nextConfig;
