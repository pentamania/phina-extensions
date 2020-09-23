// Create rollup-build index file programmatically
// @TODO エラーハンドリング

const recursive = require("recursive-readdir");
const {
  srcPath,
  indexFile_esm,
  indexFile_umd,
  indexFile_esmAsESClass,
} = require("./build.config.js");
const writeFileAsync = require("util").promisify(require("fs").writeFile);
const trimExt = function (str) {
  return str.replace(/\.[^/.]+$/, "");
};

const ignoredFilePatterns = [
  "*index*.*", // index.js, etc.
  "_*.*", // "_"から始まるフォルダを無視
  "*.jsdoc", // 特定の拡張子を無視
];
let scriptBody_esm = "";
let scriptBody_umd = "";
let scriptBody_esmAsClass = "";
const esClassConvertFuncName = "toESClass";

(async () => {
  /* Create module path list */
  const files = await recursive(srcPath, ignoredFilePatterns);
  files.sort(); // recursive-readdirは順番を保証しないため
  const moduleList = files.map((f, i) => {
    const pathArray = f.split("\\"); // get path by directory
    pathArray.shift(); // trim "src"

    const moduleName = trimExt(pathArray[pathArray.length - 1]);
    const modulePath = `./${pathArray.join("/")}`; // srcからの相対パスに変換
    const moduleNamespace = `phina.${trimExt(pathArray.join("."))}`;
    // console.log(moduleName, modulePath, moduleNamespace);

    return {
      name: moduleName,
      path: modulePath,
      namespace: moduleNamespace,
    };
  });

  /* Add import/export syntax to scripts */
  moduleList.forEach((m, i) => {
    scriptBody_esm += `export \{ default as ${m.name} \} from \'${m.path}\'\;\n`;
    scriptBody_umd += `import ${m.name} from \'${m.path}\'\;\n`;
    scriptBody_esmAsClass += `import ${m.name} from \'${m.path}\'\;\n`;
  });

  moduleList.forEach((m, i) => {
    // UMD: add phina.register for umd build script
    scriptBody_umd += `phina.register\(\'${m.namespace}\', ${m.name}\)\;\n`;

    // esmAsClass: Convert and assign
    // ex> const _AfterImage = toESClass(AfterImage);
    if (!(m.name === esClassConvertFuncName)) {
      scriptBody_esmAsClass += `const _${m.name} = ${esClassConvertFuncName}(${m.name});\n`;
    }
  });

  // esmAsClass: "export as { ... }"
  scriptBody_esmAsClass += `export {\n`;
  moduleList.forEach((m, i) => {
    if (!(m.name === esClassConvertFuncName)) {
      scriptBody_esmAsClass += `\t_${m.name} as ${m.name}\,\n`;
    }
  });
  scriptBody_esmAsClass += `}\;`;

  /* Write file */
  await writeFileAsync(indexFile_esm, scriptBody_esm);
  await writeFileAsync(indexFile_umd, scriptBody_umd);
  await writeFileAsync(indexFile_esmAsESClass, scriptBody_esmAsClass);

  console.log("prebuild complete");
})();
