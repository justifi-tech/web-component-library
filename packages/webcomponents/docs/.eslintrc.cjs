const mdx = require('eslint-plugin-mdx');

module.exports = [
  {
    files: ['**/*.md', '**/*.mdx'],
    plugins: { mdx },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
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
