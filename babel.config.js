module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          ie: 11,
          chrome: 27,
          firefox: 30,
          safari: 7,
          opera: 23,
        },
        loose: true,
        modules: false,
        exclude: ["transform-regenerator"],
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-syntax-dynamic-import", { loose: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    [
      "@babel/plugin-transform-runtime",
      { corejs: false, helpers: true, regenerator: false, useESModules: true },
    ],
  ],
};
