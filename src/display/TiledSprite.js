
/**
 * 指定したスプライトをタイル状にリピード描画する。<br>
 * 背景スクロールなどに使用。
 * @see https://qiita.com/pentamania/items/ab736338d7b3b81b94cd
 * @class phina.display.TiledSprite
 * @memberOf phina.display
 * @extends phina.display.DisplayElement
 *
 * @example
 * // 背景をx軸スクロールする
 * const SCROLL_SPEED = 4;
 * const bgImage = phina.display.TiledSprite("background")
 *   .addChildTo(this)
 *   .on('enterframe', function() {
 *     this.offsetX -= SCROLL_SPEED;
 *   })
 * ;
 *
 * @param {String | phina.asset.Texture | phina.graphics.Canvas} image
 * @param {Number} [width]
 * @param {Number} [height]
 */
export default phina.createClass({
  superClass: phina.display.DisplayElement,

  init: function(image, width, height) {
    this.superInit();

    this._tileWidth = 0;
    this._tileHeight = 0;
    this._image = null;
    this._tempCanvas = phina.graphics.Canvas();
    this._canvasPattern = null;
    this.srcRect = phina.geom.Rect();
    this.offset = phina.geom.Vector2(0, 0);

    this.setImage(image, width, height);
  },

  /**
   * 画像をセット
   * @override
   * @instance
   * @memberOf phina.display.TiledSprite
   *
   * @param {String | phina.asset.Texture | phina.graphics.Canvas} image
   * @param {Number} [width]
   * @param {Number} [height]
   * @return {this}
   */
  setImage: function(image, width, height) {
    if (typeof image === 'string') {
      image = phina.asset.AssetManager.get('image', image);
    }
    this._image = image;
    this.width = this._image.domElement.width;
    this.height = this._image.domElement.height;

    if (width) { this.width = width; }
    if (height) { this.height = height; }
    this._tileWidth = this.width;
    this._tileHeight = this.height;

    this.frameIndex = 0; // run setFrameIndex

    return this;
  },

  /**
   * indexに応じてタイル化範囲をセット
   * @override
   * @instance
   * @memberOf phina.display.TiledSprite
   *
   * @param {Number} index
   * @param {Number} [width] タイル幅
   * @param {Number} [height] タイル高さ
   * @return {this}
   */
  setFrameIndex: function(index, width, height) {
    var tw  = width || this._tileWidth || this._width;
    var th  = height || this._tileHeight || this._height;
    var row = ~~(this.image.domElement.width / tw);
    var col = ~~(this.image.domElement.height / th);
    var maxIndex = row*col;
    index = index%maxIndex;

    var x = index%row;
    var y = ~~(index/row);
    this.srcRect.x = x*tw;
    this.srcRect.y = y*th;
    this.srcRect.width  = tw;
    this.srcRect.height = th;

    this._frameIndex = index;

    this._tileWidth = tw;
    this._tileHeight = th;
    this._renderPattern();

    return this;
  },

  /**
   * 原点オフセットを一括セット
   * @instance
   * @memberOf phina.display.TiledSprite
   *
   * @param {Number} x
   * @param {Number} y
   * @return {this}
   */
  setOffset: function(x, y) {
    this.offset.x = x;
    this.offset.y = y;
    return this;
  },

  /**
   * パターン元となるタイル画像を内部キャンバスに描画
   * @private
   * @instance
   * @memberOf phina.display.TiledSprite
   *
   * @return {void}
   */
  _renderPattern: function() {
    var tempCanvas = this._tempCanvas;
    var image = this.image.domElement;
    var srcRect = this.srcRect;
    tempCanvas.clear().setSize(srcRect.width, srcRect.height);
    tempCanvas.drawImage(image,
      srcRect.x, srcRect.y, srcRect.width, srcRect.height,
      0, 0, srcRect.width, srcRect.height
    );
    this._canvasPattern = tempCanvas.context.createPattern(tempCanvas.canvas, 'repeat');
  },

  /**
   * 描画処理。rendererによって毎フレーム実行される
   * @private
   * @override
   * @instance
   * @memberOf phina.display.TiledSprite
   *
   * @param {phina.graphics.Canvas} canvas rendererのcanvas
   * @return {void}
   */
  draw: function(canvas) {
    var context = canvas.context;
    context.fillStyle = this._canvasPattern;
    context.translate(
      -this._width * this.originX - this.offset.x,
      -this._height * this.originY - this.offset.y
    );
    context.fillRect(this.offset.x, this.offset.y, this._width, this._height);
  },

  _accessor: {

    /**
     * 画像テクスチャ
     * @instance
     * @memberOf phina.display.TiledSprite
     * @type {phina.asset.Texture | phina.graphics.Canvas}
     */
    image: {
      get: function() { return this._image; },
      set: function(v) { this.setImage(v); }
    },

    /**
     * テクスチャをフレーム分割していた場合のインデックス
     * @instance
     * @memberOf phina.display.TiledSprite
     * @type {number}
     */
    frameIndex: {
      get: function() { return this._frameIndex; },
      set: function(idx) { this.setFrameIndex(idx); }
    },

    /**
     * x軸原点オフセット
     * @instance
     * @memberOf phina.display.TiledSprite
     * @type {number}
     */
    offsetX: {
      get: function() { return this.offset.x; },
      set: function(v) { this.offset.x = v; }
    },

    /**
     * y軸原点オフセット
     * @instance
     * @memberOf phina.display.TiledSprite
     * @type {number}
     */
    offsetY: {
      get: function() { return this.offset.y; },
      set: function(v) { this.offset.y = v; }
    },
  },

});