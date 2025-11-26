module.exports = {
  root: true,
  settings: {
    'mdx/remark': {
      plugins: ['remark-frontmatter'],
    },
  },
  overrides: [
    {
      files: ['**/*.md', '**/*.mdx'],
      extends: ['plugin:mdx/recommended'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        'mdx/no-unused-expressions': 'off',
        'mdx/no-jsx-html-comments': 'off',
      },
    },
  ],
};
