/* global phina:false */

/**
 * 任意のオブジェクトでクリッピングマスク可能なレイヤー
 * @class phina.display.MaskedLayer
 * @memberOf phina.display
 * @extends phina.display.CanvasLayer
 *
 * @example
 * import {MaskedLayer} from '@pentamania/phina-extensions'
 * // const MaskedLayer = phina.display.MaskedLayer; // browser.ver
 *
 * phina.define('MainScene', {
 *   superClass: 'DisplayScene',
 *
 *   init: function(options) {
 *     this.superInit(options);
 *
 *     // クリッピングマスク用のスプライト
 *     var maskObj = Sprite('logo')
 *       .setPosition(this.width * 0.5, this.height * 0.5)
 *
 *     // レイヤー本体
 *     this.maskLayer = MaskedLayer(options)
 *       .addClippingMask(maskObj) // 追加
 *       .setOrigin(0, 0)
 *       .addChildTo(this);
 *
 *     // maskLayerに追加されるとクリッピングされる
 *     StarShape({
 *       radius: 300
 *     })
 *       .addChildTo(this.maskLayer)
 *   },
 * });
 *
 * @param {object} options - extends phina.display.CanvasLayer parameters
 */
export default phina.createClass({
  superClass: phina.display.CanvasLayer,

  _rootLayer: null,
  _maskLayer: null,

  /** 
   * constructor
   */
  init: function(options) {
    // options = ({}).$extend(DEFAULT_PARAMS, options);
    this.superInit(options);

    this._rootLayer = phina.display.DisplayElement(options);
    this.superMethod('addChild', this._rootLayer);

    // this._maskLayer = phina.display.DisplayElement(options);
    this._maskLayer = phina.display.CanvasLayer(options);
    this._maskLayer.setOrigin(0, 0);
    this._maskLayer.blendMode = "destination-in";
    this.superMethod('addChild', this._maskLayer);
  },

  /**
   * クリッピングに使うオブジェクトをセット
   * @instance
   * @memberof phina.display.MaskedLayer
   *
   * @return {this}
   */
  addClippingMask: function(obj) {
    this._maskLayer.addChild(obj);
    return this;
  },

  /**
   * @override
   * @instance
   * @memberof phina.display.MaskedLayer
   * 
   * @param {Number} v - Width of layer
   * @return {this}
   */
  setWidth(v) {
    this.canvas.width = v;
    this._rootLayer.width = v;
    this._maskLayer.width = v;
    this._width = v;
    return this;
  },

  /**
   * @override
   * @instance
   * @memberof phina.display.MaskedLayer
   * 
   * @param {Number} v - Height of layer
   * @return {this}
   */
  setHeight(v) {
    this.canvas.height = v;
    this._rootLayer.height = v;
    this._maskLayer.height = v;
    this._height = v;
    return this;
  },

  /**
   * 直接ではなく_rootLayerに追加するように上書き
   * @override
   *
   * @return {void}
   */
  addChild: function(child) {
    if (child.parent) child.remove();

    child.parent = this._rootLayer;
    this._rootLayer.children.push(child);

    child.has('added') && child.flare('added');

    return child;
  },

  /**
   * _rootLayerからremoveするように上書き
   * @override
   *
   * @return {this}
   */
  removeChild: function(child) {
    var index = this._rootLayer.children.indexOf(child);
    if (index !== -1) {
      this._rootLayer.children.splice(index, 1);
      child.has('removed') && child.flare('removed');
    }
    return this;
  },

  _accessor: {
    // @TODO
    // スーパークラスのLayer.initでwidth/heightが代入されるが、その段階でcanvasその他が無いのでエラーになってしまう
    // 存在確認すればOK？
    // width: {
    //   get: function() { return this._width; },
    //   set: function(v) {
    //     this.canvas.width = v;
    //     this._rootLayer.width = v;
    //     this._maskLayer.width = v;
    //     this._width = v;
    //   }
    // },
  },

});