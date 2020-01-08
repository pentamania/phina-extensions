/**
 * Create rollup-build index file programmatically
 * @TODO エラーハンドリング
 */

const recursive = require("recursive-readdir");
const {srcPath, indexFileOutput_esm, indexFileOutput_umd} = require('./build.config.js');
const writeFileAsync = require('util').promisify(require('fs').writeFile);
const trimExt = function(str) { return str.replace(/\.[^/.]+$/, "") };

const ignoredFilePatterns = [
  "*index*.*",　// index.js, etc.
  "_*.*", // "_"から始まるフォルダを無視
  "*.jsdoc" // 特定の拡張子を無視
];
let scriptBody_esm = "";
let scriptBody_umd = "";

/**
 * main
 */
(async ()=> {

  /** 
   * create module path list
   */
  const files = await recursive(srcPath, ignoredFilePatterns);
  files.sort(); // recursive-readdirは順番を保証しないため
  const moduleList = files.map((f, i)=> {
    const pathArray = f.split("\\"); // get path by directory
    pathArray.shift(); // trim "src"
  
    const moduleName = trimExt(pathArray[pathArray.length-1]);
    const modulePath = `./${pathArray.join("\/")}`; // srcからの相対パスに変換
    const moduleNamespace = `phina.${trimExt(pathArray.join("."))}`;
    // console.log(moduleName, modulePath, moduleNamespace);

    return {
      name: moduleName,
      path: modulePath,
      namespace: moduleNamespace
    }
  });
  
  /**
   * add import/export syntax to scripts
   */
  moduleList.forEach((m, i)=> {
    scriptBody_esm += `export \{ default as ${m.name} \} from \'${m.path}\'\;\n`;
    scriptBody_umd += `import ${m.name} from \'${m.path}\'\;\n`;
  });

  /**
   * add phina.register for umd build script
   * import文の後にしか書けないので個別にforEach
   */
  moduleList.forEach((m, i)=> {
    scriptBody_umd += `phina.register\(\'${m.namespace}\', ${m.name}\)\;\n`;
  });

  /** 
   * write file
   */
  await writeFileAsync(indexFileOutput_esm, scriptBody_esm)
  await writeFileAsync(indexFileOutput_umd, scriptBody_umd)

  console.log('prebuild end');
})();
