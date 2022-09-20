'use strict';

module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:eslint-plugin/recommended',
		'plugin:eslint-plugin-node/recommended',
	],
	env: {
		node: true,
	},
	parserOptions: {
		ecmaVersion: 'latest',
	},
	overrides: [
		{
			files: ['tests/**/*.js'],
			env: { mocha: true },
		},
	],
};
