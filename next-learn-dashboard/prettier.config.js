const styleguide = require('@vercel/style-guide/prettier');
const packageJsonPlugin = require.resolve('prettier-plugin-packagejson', {
  paths: [require.resolve('@vercel/style-guide/prettier')],
});

module.exports = {
  ...styleguide,
  plugins: [packageJsonPlugin, 'prettier-plugin-tailwindcss'],
};
