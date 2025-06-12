import nextPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    domains: ['drive.google.com'],
  },
};

// Wrap base config with nextPwa
export default nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(baseConfig);
