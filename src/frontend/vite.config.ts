import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@backend': path.resolve(__dirname, '../backend'),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'https://doge.allanjeremy.com',
				changeOrigin: true,
			},
		},
	},
});
