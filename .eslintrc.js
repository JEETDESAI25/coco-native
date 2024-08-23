module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Shows Prettier errors as ESLint errors
    'react-native/no-inline-styles': 0,
  },
};
