import { defineConfig, mergeConfig } from 'vitest/config';
import { vitestBase } from './vitest.config.base';

export default mergeConfig(
	vitestBase,
	defineConfig({
		test: {
			include: ['**/__tests__/p0/**/*.test.ts'],
			exclude: ['**/node_modules/**', '**/dist/**', '**/.*/**'],
		},
	}),
);
