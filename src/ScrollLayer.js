/* global phina:false */

var SCROLL_TYPES = ['instant', 'linear', 'slip'];
var DEFAULT_SCROLL_TYPE = 'linear';
var DEFAULT_SCROLL_SPEED = 8;
var DEFAULT_SCROLL_SLIP_FRICTION = 0.1;

/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} y
 */

/**
 * 対象に合わせて自身の位置を調整し、スクロールしているように見せるレイヤークラス。
 * @class phina.display.ScrollLayer
 * @memberOf phina.display
 * @extends phina.display.DisplayElement
 *
 * @example
 * phina.globlize();
 * const SCREEN_WIDTH = 720;
 * const SCREEN_HEIGHT = 1080;
 *
 * // in Scene Class...
 *
 * // setup layer
 * const layer = ScrollLayer({
 *   lockY: true,
 * })
 *   .setCoordinate(SCREEN_WIDTH/2, SCREEN_HEIGHT/2)
 *   .addChildTo(this);
 *
 * // setup target
 * this.player = Sprite('player').addChildTo(layer);
 * layer.setTarget(this.player)
 *
 * @param {object} [options] - phina.display.DisplayElementのパラメータも有効です。
 *   @param {string} [options.scrollType=linear] - スクロールの方法を指定：'instant', 'linear', 'slip'
 *   @param {number} [options.scrollSpeed=8] - スクロール速度を指定。scrollType:'linear'の時のみ有効
 *   @param {number} [options.scrollFriction=0.1] - slipスクロール時のフォーカス挙動を指定。scrollType:'slip'の時のみ有効
 *   @param {boolean} [options.lockX=false] - x軸スクロールを禁止
 *   @param {boolean} [options.lockY=false] - y軸スクロールを禁止
 */
export default phina.createClass({
  superClass: phina.display.DisplayElement,

  init: function(options) {
    options = ({}).$safe(options, {
      lockX: false,
      lockY: false,
      scrollType: DEFAULT_SCROLL_TYPE,
      scrollSpeed: DEFAULT_SCROLL_SPEED,
      scrollFriction: DEFAULT_SCROLL_SLIP_FRICTION,
    });
    this.superInit(options);
    this._isLockedX = options.lockX;
    this._isLockedY = options.lockY;
    this._scrollType;
    this._focusTarget = options.focusTarget || phina.geom.Vector2(0, 0);
    this._coordinate = phina.geom.Vector2(0, 0);
    if (options.coordinate) this.setCoordinate(options.coordinate.x, options.coordinate.y);

    this.scrollSpeed = options.scrollSpeed;
    this.scrollFriction = options.scrollFriction;
    this.scrollType = options.scrollType;
    this.on('enterframe', this._updatePosition.bind(this));
  },

  /**
   * <pre>
   * focusTargetがcoordinate座標に来るようレイヤーをずらす
   * 毎フレーム実行、ただし位置が変わらないときは何もしない
   * Move layer position to focus target, executed every frame
   * </pre>
   * @instance
   * @private
   * @memberof phina.display.ScrollLayer
   *
   * @return {void}
   */
  _updatePosition: function() {
    var destX = this._coordinate.x - this._focusTarget.x;
    var destY = this._coordinate.y - this._focusTarget.y;
    var deltaX = destX - this.x;
    var deltaY = destY - this.y;

    // x-axis update
    if (!this._isLockedX && deltaX !== 0) {
      switch (this._scrollType) {
        case "instant":
          // 瞬時に合わせる
          this.x = destX;
          break;
        case "linear":
          // 線形移動で合わせる：ちょっとずつ定数加算
          this.x = (destX > 0)
            ? Math.min(destX, this.x + this.scrollSpeed)
            : Math.max(destX, this.x - this.scrollSpeed)
          break;
        case "slip":
          // 滑るように合わせる：差分(目標値 - 現在値) * 0.1 を ちょっとずつ加算することでなめらかに
          this.x += (destX - this.x) * this.scrollFriction;
          break;
        // TODO: custom scrolling feature
        // case "custom":
        //   this.customXScroll();
        //   break;

        default:
          this.x = destX;
          break;
      }
    }

    // y-axis update
    if (!this._isLockedY && deltaY !== 0) {
      switch (this._scrollType) {
        case "instant":
          this.y = destY;
          break;
        case "linear":
          this.y = (destY > 0)
            ? Math.min(destY, this.y + this.scrollSpeed)
            : Math.max(destY, this.y - this.scrollSpeed)
          break;
        case "slip":
          this.y += (destY - this.y) * 0.1;
          break;
        // TODO: custom scrolling feature
        // case "custom":
        //   this.customYScroll();
        //   break;

        default:
          this.y = destY;
          break;
      }
    }
  },

  /**
   * 注視対象を指定<br>
   * Set focusTarget
   * @instance
   * @memberof phina.display.ScrollLayer
   *
   * @param {Vector2} focusTarget
   * @return {this}
   */
  setTarget: function(focusTarget) {
    this._focusTarget = focusTarget;
    return this;
  },

  /**
   * 注視対象の画面表示位置をセット<br>
   * 例えば画面中心に映したいなら画面サイズ半分を指定する<br>
   * Set coordinate of focusTarget screen position.
   * layer.setCoordinate(this.width/2, this.height/2)
   * @instance
   * @memberof phina.display.ScrollLayer
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @return {this}
   */
  setCoordinate: function(x, y) {
    this._coordinate.set(x, y);
    return this;
  },

  /**
   * Lock x or y-axis scrolling
   * @instance
   * @memberof phina.display.ScrollLayer
   *
   * @param {boolean} x - lock x-axis scroll
   * @param {boolean} y - lock y-axis scroll
   * @return {this}
   */
  setLock: function(x, y) {
    this.lockX = x;
    if (y !== undefined) this.lockY = y
    return this;
  },

  _accessor: {

    /**
     * @property    scrollType
     */
    scrollType: {
      get: function() { return this._scrollType; },
      set: function(v) {
        v = v.toLowerCase();
        if (!SCROLL_TYPES.contains(v)) {
          console.warn("[phina warn] scroll type '{0}' does not exist.".format(v))
        }
        this._scrollType = v;
      }
    },

    /**
     * @property    coordinate
     * getter only
     */
    coordinate: {
      get: function() { return this._coordinate.clone(); },
    },

    /**
     * @property    lock
     * setter only
     */
    lock: {
      set: function(v) {
        this._isLockedX = (v === true);
        this._isLockedY = (v === true);
      }
    },

    /**
     * @property    lockX
     */
    lockX: {
      get: function() { return this._isLockedX; },
      set: function(v) {
        this._isLockedX = (v === true);
      }
    },

    /**
     * @property    lockY
     */
    lockY: {
      get: function() { return this._isLockedY; },
      set: function(v) {
        this._isLockedY = (v === true);
      }
    },
  },

});