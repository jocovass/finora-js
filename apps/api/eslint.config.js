import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import nodePlugin from 'eslint-plugin-n';
import securityPlugin from 'eslint-plugin-security';
import vitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';

export default tseslint.config([
	globalIgnores(['dist/**', 'build/**', 'coverage/**', 'node_modules/**']),

	// Base configuration for all TypeScript files
	{
		files: ['src/**/*.ts'],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			importX.flatConfigs.recommended,
			importX.flatConfigs.typescript,
			nodePlugin.configs['flat/recommended'],
			securityPlugin.configs.recommended,
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: 2022,
				sourceType: 'module',
			},
			globals: {
				...globals.node,
				...globals.es2022,
			},
		},
		settings: {
			'import-x/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
				node: true,
			},
			node: {
				version: '>=18.0.0',
			},
		},
		rules: {
			// TypeScript specific rules
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/await-thenable': 'error',

			// Import rules
			'import-x/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
			'import-x/no-unresolved': 'error',
			'import-x/no-cycle': 'error',
			'import-x/no-unused-modules': 'warn',

			// Node.js specific rules
			'n/no-missing-import': 'off', // TypeScript handles this
			'n/no-unsupported-features/es-syntax': 'off', // We're transpiling
			'n/no-unsupported-features/node-builtins': 'error',
			'n/prefer-global/process': 'error',
			'n/prefer-global/console': 'error',
			'n/no-process-exit': 'warn',

			// Security rules
			'security/detect-object-injection': 'warn',
			'security/detect-non-literal-regexp': 'warn',
			'security/detect-unsafe-regex': 'error',

			// General code quality
			'no-console': 'warn',
			'prefer-const': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'prefer-template': 'error',
		},
	},

	// Test files configuration
	{
		files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts'],
		...vitest.configs.recommended,
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: 2022,
				sourceType: 'module',
			},
			globals: {
				...globals.node,
				...globals.es2022,
			},
		},
		settings: {
			'import-x/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
				node: true,
			},
		},
		rules: {
			...vitest.configs.recommended.rules,
			// Allow console.log in tests
			'no-console': 'off',
			// Allow any in tests for mocking
			'@typescript-eslint/no-explicit-any': 'off',
			// Allow non-null assertions in tests
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},

	// Development files
	{
		files: ['**/*.config.ts', '**/scripts/**/*.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.node.json',
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		rules: {
			'no-console': 'off',
			'n/no-process-exit': 'off',
		},
	},
	// JS
	{
		files: ['**/*.js'],
		extends: [js.configs.recommended],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
		},
		rules: {
			'no-console': 'off',
			'n/no-process-exit': 'off',
		},
	},

	// Prettier config (must be last)
	eslintConfigPrettier,
]);
