import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import { globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config([
	globalIgnores(['dist/**', 'build/**', 'coverage/**', 'node_modules/**']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
			reactX.configs['recommended-typescript'],
			reactDom.configs.recommended,
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.app.json',
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: 2022,
				sourceType: 'module',
			},
			ecmaVersion: 2020,
			globals: globals.browser,
		},
	},

	// Development files
	{
		files: ['**/*.config.ts', '**/scripts/**/*.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.node.json', // ← Config files use app config
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
