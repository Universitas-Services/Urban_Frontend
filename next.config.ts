import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Por si alguna acción aún recibe multipart en local; en Netlify el PDF
    // se sube directo a Cloud Run (ver documents-upload.client.ts).
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
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
