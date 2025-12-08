const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat();

module.exports = [
  ...compat.extends('plugin:mdx/recommended'),
  {
    rules: {
      'mdx/no-unused-expressions': 'off',
      'mdx/no-jsx-html-comments': 'off',
    },
    settings: {
      'mdx/remark': {
        plugins: ['remark-frontmatter'],
      },
    },
  },
];
