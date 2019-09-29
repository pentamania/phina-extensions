@pentamania/phina-extensions
===

Library of cool extensions for phina.js.  

## Install
```npm install @pentamania/phina-extensions```

## Example (ES Modules ver.)

```js
import phina from 'phina.js'; // add phina to global
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
```

## Example (Browser ver.)

```html
<script src='path/to/phina.js'></script>
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
</script>

```

## CDN
👉 [https://cdn.jsdelivr.net/npm/@pentamania/phina-extensions@latest/dist/phina-extensions.min.js](https://cdn.jsdelivr.net/npm/@pentamania/phina-extensions@latest/dist/phina-extensions.min.js)

## Module List
👉 [https://pentamania.github.io/phina-extensions/](https://pentamania.github.io/phina-extensions/)

## Develop

##### Install development modules

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

##### Build!

```npm run build```: build

```npm start```: build + watch

Files are output inside ```dist``` folder.