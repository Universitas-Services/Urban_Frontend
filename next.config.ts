import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/biblioteca-girs',
                destination: '/biblioteca-legal',
                permanent: true,
            },
            {
                source: '/biblioteca-girs/:categoria',
                destination: '/biblioteca-legal/:categoria',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
