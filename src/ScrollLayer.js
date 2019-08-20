/* global phina:false */

var DEFAULT_SCROLL_SPEED = 8;

/**
 * @typedef {Object} ScrollLayerParam
 * @extends phinaDisplayElementParams
 * @property {boolean} lockX? - lock x-axis scroll
 * @property {boolean} lockY? - lock y-axis scroll
 * @property {number} scrollSpeed? - only for linear scrolling
 * @property {string} scrollType? - default, linear, slip
 */

/**
 * @class  ScrollLayer
 * TODO: typeによって処理分ける
 *   scrollType: default, linear, slide
 * @see
 * @param {ScrollLayerParam} options
 */
export default phina.createClass({
  superClass: phina.display.DisplayElement,

  init: function(options) {
    options = ({}).$safe(options, {
      lockX: false,
      lockY: false,
      scrollSpeed: DEFAULT_SCROLL_SPEED,
    });
    this.superInit(options);
    this._isLockedX = options.lockX;
    this._isLockedY = options.lockY;
    this.scrollSpeed = options.scrollSpeed;

    /* 注視対象 */
    this.focusTarget = options.focusTarget || phina.geom.Vector2(0, 0);

    /**
     * coordinate
     * 注視対象が画面内のどの位置に収まるかを設定
     * 例えば中心なら画面サイズの半分を指定
     */
    this._coordinate = phina.geom.Vector2(0, 0);
    if (options.coordinate) this.setCoordinate(options.coordinate.x, options.coordinate.y);

    this.on('enterframe', this._updatePosition.bind(this));
  },

  /**
   * @private
   * focusTargetがcoordinate座標に来るようレイヤーをずらす
   * 位置が変わらないときは何もしない
   * @return {void}
   */
  _updatePosition: function() {
    var destX = this._coordinate.x - this.focusTarget.x;
    var destY = this._coordinate.y - this.focusTarget.y;
    var deltaX = destX - this.x;
    var deltaY = destY - this.y;

    if (!this._isLockedX && deltaX !== 0) {
      // 1. 瞬時に合わせる
      // this.x = destX;

      // 2: 線形移動で合わせる：ちょっとずつ定数加算
      this.x = (destX > 0)
        ? Math.min(destX, this.x + this.scrollSpeed)
        : Math.max(destX, this.x - this.scrollSpeed)

      // 3: 滑るように合わせる：差分(目標値 - 現在値) * 0.1 を ちょっとずつ加算することでなめらかに
      //
      // this.x += (destX - this.x) * 0.1;
    }

    if (!this._isLockedY && deltaY !== 0) {
      // this.y = destY;

      this.y = (destY > 0)
        ? Math.min(destY, this.y + this.scrollSpeed)
        : Math.max(destY, this.y - this.scrollSpeed)

      // this.y += (destY - this.y) * 0.1;
    }
  },

  setTarget: function(focusTarget) {
    this.focusTarget = focusTarget;
    return this;
  },

  setCoordinate: function(x, y) {
    this._coordinate.set(x, y);
    return this;
  },

  setLock: function(x, y) {
    this.lockX = x;
    if (y !== undefined) this.lockY = y
    return this;
  },

  _accessor: {
    coordinate: {
      get: function() { return this._coordinate; },
      set: function(v) {
        this._coordinate.set(x, y);
        this._updateView();
      }
    },

    // スクロールをロック
    lock: {
      set: function(v) {
        this._isLockedX = (v === true);
        this._isLockedY = (v === true);
      }
    },

    lockX: {
      get: function() { return this._isLockedX; },
      set: function(v) {
        this._isLockedX = (v === true);
      }
    },

    lockY: {
      get: function() { return this._isLockedY; },
      set: function(v) {
        this._isLockedY = (v === true);
      }
    },
  },

});