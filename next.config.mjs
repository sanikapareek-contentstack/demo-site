/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: () => {    
    return  process.env.CONTENTSTACK_LAUNCH_DEPLOYMENT_UID
  },
};

export default nextConfig;
