/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable spaced-comment */
/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/) import path from "path";
import path from "path";
import { defineConfig } from "vite";

import packageJson from "./package.json";

/**
 * Take the name from package.json and grab the last part
 * eg getPackageName "@krakenjs/foobar" -> "foobar"
 */
const getPackageName = () => {
  const npmName = packageJson.name;
  return npmName.split("/").slice(-1)[0];
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.iife`,
};

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: getPackageNameCamelCase(),
      fileName: (format) => `${getPackageNameCamelCase()}.${format}.js`,
      formats: ["es", "cjs", "iife", "umd"],
    },
    sourcemap: true,
    //rollupOptions: {
    //ouput: {
    //dir: "./dist/",
    //preserveModules: true,
    //preserveModulesRoot: 'src',
    //},
    //},
  },
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  },
});
