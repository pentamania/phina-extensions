@pentamania/phina-extensions
===

pentamania's personal extensions for phina.js.  
Supports both esm and web.

## Install
```npm install @pentamania/phina-extensions```

## Example (ES Modules)
Recommended for Tree-shaking

```js
import * as phina from 'phina.js';
import {Fader} from '@pentamania/phina-extensions';

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

## Example (web)

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
[https://cdn.jsdelivr.net/npm/@pentamania/phina-extensions@latest/dist/phina-extensions.min.js](https://cdn.jsdelivr.net/npm/@pentamania/phina-extensions@latest/dist/phina-extensions.min.js)

## Module List
Documentation: TODO 

- phina.accessory.Fader
- phina.accessory.AfterImage
- phina.accessory.Drawer
- phina.ui.ScrollableLabelArea
- phina.display.ScrollLayer
- phina.game.Sequence
- phina.extendWorldCollision