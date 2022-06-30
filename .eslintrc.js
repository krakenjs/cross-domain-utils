module.exports = {
  extends:
    "./node_modules/@krakenjs/grumbler-scripts/config/.eslintrc-typescript.js",

  globals: {
    __TEST__: true,
  },

  rules: {
    "no-mixed-operators": "off",
    // off for initial ts conversion
    "@typescript-eslint/no-implicit-any-catch": "off",
  },
};
