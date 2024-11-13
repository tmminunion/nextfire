import type { NextConfig } from "next";


const  nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*', // Path API yang ingin diberi header CORS
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Mengizinkan semua origin, atau ganti dengan domain spesifik
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Metode HTTP yang diizinkan
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization', // Header yang diizinkan
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true', // Mengizinkan pengiriman credentials (mis. cookies, authorization headers)
          },
        ],
      },
    ];
  },
};

export default nextConfig;
