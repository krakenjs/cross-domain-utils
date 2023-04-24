module.exports = {
  extends:
    "./node_modules/@krakenjs/eslint-config-grumbler/eslintrc-typescript",

  rules: {
    "keyword-spacing": "off",
    "@typescript-eslint/keyword-spacing": "off",

    // off for initial ts conversion
    //  Implicit any in catch clause
    "@typescript-eslint/no-implicit-any-catch": "off",
    // Prefer using an optional chain expression instead, as it's more concise and easier to read
    "@typescript-eslint/prefer-optional-chain": "off",
    // Prefer using nullish coalescing operator (`??`) instead of a logical or (`||`), as it is a safer operator
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    // Generic Object Injection Sink
    "security/detect-object-injection": "off",
  },
};
