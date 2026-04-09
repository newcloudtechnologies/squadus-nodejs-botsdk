module.exports = {
    extends: ['@squadus/eslint-config'],

    parserOptions: {
        ecmaVersion: 2020,
        project: ['./tsconfig.json'],
        sourceType: 'module',
    },
    rules: {
        semi: 'error',
        camelcase: 'off',
        'comma-style': ['error', 'last'],
        'max-depth': ['error', 4],
        'no-delete-var': 'error',
        'no-console': [
            'warn',
            {
                allow: ['warn', 'error', 'time', 'timeEnd'],
            },
        ],
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/promise-function-async': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        // Disable react-hooks rules not available in eslint-plugin-react-hooks v5
        'react-hooks/immutability': 'off',
        'react-hooks/refs': 'off',
        'react-hooks/set-state-in-effect': 'off',
        'react-hooks/set-state-in-render': 'off',
        'react-hooks/static-components': 'off',
        'no-warning-comments': [
            'warn',
            {
                terms: ['todo', 'fixme', 'any other term'],
                location: 'anywhere',
            },
        ],
    },
};
