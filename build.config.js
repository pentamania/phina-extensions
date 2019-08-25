module.exports = {
  moduleList: [
    {
      name: 'Fader',
      filePath: './Fader.js', // from src root
      phinaPath: 'phina.accessory.Fader',
      isDefaultExport: true,
    },
    {
      name: 'AfterImage',
      filePath: './AfterImage.js',
      phinaPath: 'phina.accessory.AfterImage',
      isDefaultExport: true,
    },
    {
      name: 'Drawer',
      filePath: './Drawer.js',
      phinaPath: 'phina.accessory.Drawer',
      isDefaultExport: true,
    },
    {
      name: 'ScrollableLabelArea',
      filePath: './ScrollableLabelArea.js',
      phinaPath: 'phina.ui.ScrollableLabelArea',
      isDefaultExport: true,
    },
    {
      name: 'ScrollLayer',
      filePath: './ScrollLayer.js',
      phinaPath: 'phina.display.ScrollLayer',
      isDefaultExport: true,
    },
    {
      name: 'PetalShape',
      filePath: './PetalShape.js',
      phinaPath: 'phina.display.PetalShape',
      isDefaultExport: true,
    },
    {
      name: 'AnimationSprite',
      filePath: './AnimationSprite.js',
      phinaPath: 'phina.display.AnimationSprite',
      isDefaultExport: true,
    },
    {
      name: 'Sequence',
      filePath: './Sequence.js',
      phinaPath: 'phina.game.Sequence',
      isDefaultExport: true,
    },
    {
      name: 'extendWorldCollision',
      filePath: './extendWorldCollision.js',
      phinaPath: 'phina.extendWorldCollision',
      isDefaultExport: true,
    },
  ],
  indexFileOutput_esm: "./src/index.esm.js",
  indexFileOutput_umd: "./src/index.js",
}