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
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    rules: {
        semi: 'error',
        camelcase: 'off',
        curly: 'error',
        'comma-style': ['error', 'last'],
        'max-depth': ['error', 4],
        'no-delete-var': 'error',
        'no-confusing-arrow': 'error',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/promise-function-async': 'warn',
        'no-warning-comments': [
            'warn',
            {
                terms: ['todo', 'fixme', 'any other term'],
                location: 'anywhere',
            },
        ],
    },
};
