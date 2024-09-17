import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {},
	server: {
		proxy: {
			'/api': {
				target: 'https://api.aj-doge.workers.dev',
				changeOrigin: true,
			},
		},
	},
});
