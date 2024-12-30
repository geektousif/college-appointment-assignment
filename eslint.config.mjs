import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['src/**/*.{js,mjs,cjs,ts}'] },
    {
        plugins: {
            typescriptEslint,
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2018,
                ...globals.jest,
            },
            parser: tsParser,
        },
    },

    eslintConfigPrettier,
    eslintPluginPrettier,

    {
        ignores: ['node_modules', 'dist'],
    },
];
