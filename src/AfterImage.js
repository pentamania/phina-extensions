/* global phina:false */

/**
 * @typedef {Object} AfterImageParam
 * @property {number} interval? - The inverval of afterimage display.
 * @property {number} poolNum? - Number of pooled afterimage.
 * @property {Object} effectProps? - props for afterImage's fading tweener animation.
 * @property {number} effectDuration? - duration of the tweener animation.
 * @property {number} effectEasing? - easing of the tweener animation.
 */

const DEFAULT_PARAMS = {
  interval: 4,
  poolNum: 22,
  effectProps: { alpha: 0 },
  effectDuration: 800,
  effectEasing: 'easeOutCirc',
}

/**
 * @class phina.accessory.AfterImage
 * @memberOf phina.accessory
 * @extends phina.accessory.Accessory
 *
 * SpriteまたはShapeに残像エフェクトを付加します
 * 第二引数にfilter関数を与えることで、生成した残像テクスチャにfilterをかけることができます。
 * 注：画像が別origin由来のときはエラーになります
 * @example
 * const player = phina.display.Sprite('player').addChildTo(this);
 * const filterFunc = (pixel, i, x, y, imageData)=> {
 *   if (pixel[3] === 0) return; // pixel[3]はalpha値、0の場合は透明ピクセルなので無視
 *   imageData.data[i] *= 0.2; // r
 *   imageData.data[i + 1] *= 0; // g
 *   imageData.data[i + 2] *= 0.8; // b
 * }
 * phina.accessory.AfterImage({interval:8}, filterFunc).attachTo(player);
 *
 * @param {AfterImageParam} options
 * @param {function} filterFunc
 */
export default phina.createClass({
  superClass: phina.accessory.Accessory,

  init: function (options, filterFunc) {
    this.superInit();

    options = ({}).$extend(DEFAULT_PARAMS, options);
    this._interval = options.interval;
    this._effectProps = options.effectProps;
    this._effectDuration = options.effectDuration;
    this._effectEasing = options.effectEasing;
    this._showing = true;
    this._pool = [];
    this._afterImageTexture = null;

    this.on('attached', function() {
      if (this.target instanceof phina.display.Sprite) {
        this._afterImageTexture = this.target._image.clone();
      } else if (this.target instanceof phina.display.Shape) {
        // Shape系クラスは最初の形状から編集できない
        // console.warn("AfterImage: Shape class is not fully supported!")
        this._afterImageTexture = this._toTexture(this.target);
      }

      if (filterFunc && typeof filterFunc === 'function') {
        this._afterImageTexture.filter(filterFunc)
      }

      for (let i = 0; i < options.poolNum; i++) this.poolImage();
    });
  },

  update: function(app) {
    if (!this.target || !this._showing) return;
    if (app.frame % this._interval === 0) this._emitAfterImage();
  },

  /**
   * @private
   * @instance
   * @memberof phina.accessory.AfterImage
   */
  _emitAfterImage: function() {
    let s = this._pool.find(function(el) { return !el.parent; });
    if (!s) s = this.poolImage(); // プールに無かったら補充

    // reset AfterImage sprite
    s.setPosition(this.target.x, this.target.y)
      .setRotation(this.target.rotation)
      .setSize(this.target.width, this.target.height)
      .setScale(this.target.scaleX, this.target.scaleY)
    ;
    if (this.target.srcRect) {
      const frame = this.target.srcRect;
      s.srcRect.set(frame.x, frame.y, frame.width, frame.height)
    }
    s.alpha = 1;

    // start tweener animation
    s.tweener.clear()
      .to(this._effectProps, this._effectDuration, this._effectEasing)
      .call(function () { s.remove(); })
    ;

    // 本体より手前に描画されるよう、addChildする
    this.target.parent.children.unshift(s);
    s.parent = this.target.parent;
  },

  /**
   * Shapeをcanvasに変換
   * @private
   * @instance
   * @memberof phina.accessory.AfterImage
   *
   * @param {phina.display.Shape} shape
   * @return {phina.asset.Texture}
   */
  _toTexture: function(shape) {
    var t = phina.asset.Texture();
    shape.render(shape.canvas); // 一旦描画しておく
    var size = shape.calcCanvasSize();
    var canvas = phina.graphics.Canvas().setSize(size.width, size.height);
    canvas.context.drawImage(shape.canvas.domElement, 0, 0);
    t.domElement = canvas.domElement;
    return t;
  },

  /**
   * 表示フラグを変更
   * @instance
   * @memberof phina.accessory.AfterImage
   *
   * @param {boolean} v
   * @return {this}
   */
  setVisible: function(v) {
    this._showing = Boolean(v);
    return this;
  },

  /**
   * 残像用Spriteをプール
   * @instance
   * @memberof phina.accessory.AfterImage
   *
   * @return {phina.display.Sprite} 生成したSpriteクラス
   */
  poolImage: function() {
    var s = phina.display.Sprite(this._afterImageTexture)
    this._pool.push(s);
    return s;
  },

  /**
   * add pool-releasing process to original remove method
   * @override
   * @instance
   * @memberof phina.accessory.AfterImage
   *
   * @return {void}
   */
  remove: function() {
    this.target.detach(this);
    this.target = null;
    this._pool.length = 0; // プール開放
  },

});