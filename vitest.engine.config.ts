import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: false,
		include: ['packages/rankup/test/engine*.test.ts'],
		exclude: ['packages/rankup/test/__tests__/**'],
		setupFiles: ['packages/rankup/test/setup.ts'],
		clearMocks: true,
		restoreMocks: true,
		testTimeout: 10_000,
		hookTimeout: 10_000,
	},
});
