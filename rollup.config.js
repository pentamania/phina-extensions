import buble from "rollup-plugin-buble";
import { uglify } from "rollup-plugin-uglify";
import license from "rollup-plugin-license";
import {
  main as MAIN,
  main_min as MAIN_MIN,
  module as MODULE_DIST,
  module_es,
  // libName,
  name,
  version,
  author,
  license as LICENSE,
} from "./package.json";
const {
  indexFile_esm,
  indexFile_umd,
  indexFile_esmAsESClass,
} = require("./build.config.js");

const banner = `/*!
 * ${name} v${version}
 * ${LICENSE} Licensed
 *
 * Copyright (C) ${author}
 */`;

const commonPlugins = [
  buble(),
  license({
    banner: banner,
    // thirdParty: {
    //   output: 'dist/dependencies.txt', // 依存パッケージを羅列
    // },
  }),
];

export default [
  // umd ver.
  {
    // input: 'src/index.js',
    input: indexFile_umd,
    output: {
      // file: `dist/${libName}.js`,
      file: MAIN,
      format: "umd",
      name: "phina_ext", // required for umd-build
      globals: {
        "phina.js": "phina",
      },
    },
    external: ["phina.js"],
    plugins: commonPlugins,
  },

  // umd min ver.
  {
    // input: 'src/index.js',
    input: indexFile_umd,
    output: {
      file: MAIN_MIN,
      format: "umd",
      name: "phina_ext", // required for umd-build
      globals: {
        "phina.js": "phina",
      },
    },
    external: ["phina.js"],
    plugins: commonPlugins.concat([
      uglify({
        output: {
          comments: /^!/, // 正規表現でLicenseコメントの頭によくある/*!を検出
        },
      }),
    ]),
  },

  // esm ver.
  {
    // input: 'src/index.esm.js',
    input: indexFile_esm,
    output: {
      file: MODULE_DIST,
      format: "esm",
    },
    plugins: commonPlugins,
  },

  // esm esclassed ver.
  {
    input: indexFile_esmAsESClass,
    output: {
      file: module_es,
      format: "esm",
    },
    plugins: commonPlugins,
  },
];
