const fs = require('fs');
const {moduleList, indexFileOutput_esm, indexFileOutput_umd} = require('./build.config.js');

/**
 * create rollup-build index file programmatically
 */
let scriptBody_esm = "";
let scriptBody_umd = "";

moduleList.forEach((module)=> {
  if (module.isDefaultExport) {
    scriptBody_esm += `export \{ default as ${module.name} \} from \'${module.filePath}\'\;\n`
    scriptBody_umd += `import ${module.name} from \'${module.filePath}\'\;\n`
  } else {
    // todo
  }
});

// add phina.register
moduleList.forEach((module)=> {
  scriptBody_umd += `phina.register\(\'${module.phinaPath}\', ${module.name}\)\;\n`
});

fs.writeFileSync(indexFileOutput_esm, scriptBody_esm);
fs.writeFileSync(indexFileOutput_umd, scriptBody_umd);

console.log('prebuild end');