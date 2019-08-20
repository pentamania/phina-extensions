/* global phina:false */

/**
 * @class phina.accessory.AfterImage
 */
// phina.define('phina.accessory.AfterImage', {
export default phina.createClass({
  superClass: phina.accessory.Accessory,

  init: function (options, filterFunc) {
    this.superInit();

    options = ({}).$extend({
      interval: 4,
      poolNum: 22,
      duration: 800,
      fadeOutEasing: 'easeOutCirc',
    }, options);
    this._interval = options.interval;
    this._effectDuration = options.duration;
    this._fadeOutEasing = options.fadeOutEasing;
    this._showing = true;
    this._pool = [];
    this._afterImageTexture = null;

    this.on('attached', function() {
      if (this.target instanceof phina.display.Sprite) {
        this._afterImageTexture = this.target._image.clone();
        if (filterFunc) {
          // 画像がcross-originのときはエラーになります
          this._afterImageTexture.filter(filterFunc)
        }
      } else if (this.target instanceof phina.display.Shape) {
        // Shape系クラスは最初の形状から編集できない
        // console.warn("AfterImage: Shape class is not fully supported!")
        this._afterImageTexture = this._toTexture(this.target);
      }
      for (var i = 0; i < options.poolNum; i++) this.poolImage();
    });
  },

  update: function(app) {
    if (!this.target || !this._showing) return;

    if (app.frame % this._interval === 0) {
      var s = this._pool.find(function(el) { return !el.parent; });
      if (!s) s = this.poolImage(); // プールに無かったら補充

      // reset AfterImage sprite
      s.tweener.clear()
        .to({ alpha: 0 }, this._effectDuration, this._fadeOutEasing)
        .call(function () { s.remove(); });
      s.setPosition(this.target.x, this.target.y)
      s.setRotation(this.target.rotation)
      s.setSize(this.target.width, this.target.height)
      s.setScale(this.target.scaleX, this.target.scaleY)
      if (this.target.srcRect) {
        var frame = this.target.srcRect;
        s.srcRect.set(frame.x, frame.y, frame.width, frame.height)
      }
      s.alpha = 1;

      // 本体より手前になるよう親にaddChildする
      this.target.parent.children.unshift(s);
      s.parent = this.target.parent;
    }
  },

  /**
   * Shapeをcanvasに変換
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

  setVisible: function(v) {
    this._showing = Boolean(v);
    return this;
  },

  poolImage: function() {
    var s = phina.display.Sprite(this._afterImageTexture)
    this._pool.push(s);
    return s;
  },

  remove: function() {
    this.target.detach(this);
    this.target = null;
    this._pool.length = 0; // プール開放
  },

});