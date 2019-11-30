@pentamania/phina-extensions
===

Cool extensions for phina.js.  

## Install
```npm install @pentamania/phina-extensions```

## Example (ES Modules ver.)

```js
import phina from 'phina.js'; // import phina
import {Fader} from '@pentamania/phina-extensions'; // import module

phina.define('FadingLabel', {
  superClass: 'phina.display.Label',

  init: function(options) {
    this.superInit(options);
    this.fader = Fader().attachTo(this);
  },

  hide: function() {
    this.fader.hide();
  }
});

phina.define('MainScene', {
  superClass: 'phina.display.DisplayScene',

  init: function(options) {
    this.superInit(options);

    this.label = FadingLabel({
      text: "Click me to hide",
      stroke: "black",
      fill: "white"
    })
      .addChildTo(this)
      .setInteractive(true)
      .setPosition(this.width*0.5, this.height*0.2)
      .on('pointstart', function() {
        this.hide();
      })
    ;
  },
});

phina.main(function() {
  var app = phina.game.GameApp({
    startLabel: 'main',
    backgroundColor: "skyblue",
  });

  app.run();
});

```

## Example (Browser ver.)

```html
<!-- load phina -->
<script src='path/to/phina.js'></script>

<!-- load phina-extenstions -->
<script src='path/to/phina-extensions.js'></script>

<script type="text/javascript">
  phina.define('FadingLabel', {
    superClass: 'phina.display.Label',

    init: function(options) {
      this.superInit(options);
      this.fader = phina.accessory.Fader().attachTo(this);
    },

    hide: function() {
      this.fader.hide();
    },

  });

  /* others are same as ES Modules ver. */
</script>

```

## CDN
👉 [https://cdn.jsdelivr.net/npm/@pentamania/phina-extensions@latest/dist/phina-extensions.min.js](https://cdn.jsdelivr.net/npm/@pentamania/phina-extensions@latest/dist/phina-extensions.min.js)

## Documentation (Module List)
👉 [https://pentamania.github.io/phina-extensions-docs/](https://pentamania.github.io/phina-extensions-docs/)

## Development

##### Install dev modules

```npm install```

##### Define and Export your own module in src folder

```js
// src/Hoge.js

/**
 * [description]
 * @class phina.ns.Hoge
 * @memberOf phina.ns
 * @extends [SuperClass]
 *
 * @example
 * // TODO
 *
 * @param {SomeParam} options
 */
export default phina.createClass({
  superClass: phina.ns.[SuperClass],

  init: function(options) {
    options = ({}).$extend(DEFAULT_PARAMS, options);
    this.superInit();
  },

  /**
   * @instance
   * @memberof phina.ns.Hoge
   *
   * @return {this} - [description]
   */
  someMethod: function() {
    // do something
    return this;
  },

});
```

##### Add your module in ```build.config.js``` moduleList

```js
module.exports = {
  moduleList: [

    // ...other modules

    {
      name: 'Hoge',
      filePath: './Hoge.js', // root is src 
      phinaPath: 'phina.ns.Hoge',
      isDefaultExport: true,
    },
  ],

  // ...other options
}
```

##### Build

```npm run build```: build

```npm start```: build + watch

Files are output inside ```dist``` folder.