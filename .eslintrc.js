const path = require('path');

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        project: ['tsconfig.json'],
        sourceType: 'module',
    },
    env: {
        node: true,
    },
    plugins: ['@typescript-eslint', 'notice'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:import/recommended',
    ],
    rules: {
        semi: 'error',
        camelcase: 'off',
        curly: 'error',
        'comma-style': ['error', 'last'],
        'max-depth': ['error', 4],
        'no-delete-var': 'error',
        'no-confusing-arrow': 'error',
        'no-console': [
            'warn',
            {
                allow: ['warn', 'error', 'time', 'timeEnd'],
            },
        ],
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/promise-function-async': 'warn',
        'import/default': 'off',
        'import/named': 'error',
        'import/namespace': 'off',
        'import/no-unresolved': 'off',
        'import/no-named-as-default-member': 'off',
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    ['index', 'sibling', 'parent'],
                    'object',
                    'type',
                ],
                'newlines-between': 'always',
            },
        ],
        'no-warning-comments': [
            'warn',
            {
                terms: ['todo', 'fixme', 'any other term'],
                location: 'anywhere',
            },
        ],
        '@typescript-eslint/no-empty-function': 'warn',
        'notice/notice': [
            'error',
            {
                messages: {
                    whenFailedToMatch:
                        "Couldn't find 'Copyright', are you sure you added it?",
                },
                nonMatchingTolerance: 1,
                onNonMatchingHeader: 'replace',
                templateFile: path.resolve(__dirname, 'copyrightTemplate.js'),
            },
        ],
    },
};
