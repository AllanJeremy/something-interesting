import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths(), react()],
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
