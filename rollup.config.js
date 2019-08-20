import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import {
  main as MAIN,
  main_min as MAIN_MIN,
  module as MODULE,
  // libName,
  name,
  version,
  author,
  license as LICENSE
} from './package.json';
const {indexFileOutput_esm, indexFileOutput_umd} = require('./build.config.js');

const banner = `/*!
 * ${name} v${version}
 * ${LICENSE} Licensed
 *
 * Copyright (C) ${author}
 */`;

const plugins = [
  buble(),
  license({
    banner: banner,
    // thirdParty: {
    //   output: 'dist/dependencies.txt', // 依存パッケージを羅列
    // },
  })
];

export default [
  // umd ver.
  {
    // input: 'src/index.js',
    input: indexFileOutput_umd,
    output: {
      // file: `dist/${libName}.js`,
      file: MAIN,
      format: 'umd',
      name: "phina_ext", // required for umd-build
      globals: {
        'phina.js': 'phina',
      },
    },
    external: ['phina.js'],
    plugins: plugins,
  },

  // umd min ver.
  {
    // input: 'src/index.js',
    input: indexFileOutput_umd,
    output: {
      file: MAIN_MIN,
      format: 'umd',
      name: "phina_ext", // required for umd-build
      globals: {
        'phina.js': 'phina',
      },
    },
    external: ['phina.js'],
    plugins: plugins.concat([uglify({
      output: {
        comments: /^!/ // 正規表現でLicenseコメントの頭によくある/*!を検出
      }
    })]),
  },

  // esm ver.
  {
    // input: 'src/index.esm.js',
    input: indexFileOutput_esm,
    output: {
      file: MODULE,
      format: 'esm',
    },
    plugins: plugins,
  },
]