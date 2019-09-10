/* global phina:false */

// TODO: 最大スクロール可能位置をキャッシュ・設定する方法
var MIN_VELOCITY = 0.1;

/**
 * スクロール可能なLabelAreaクラス
 * @class phina.ui.ScrollableLabelArea
 * @memberOf phina.ui
 * @extends phina.ui.LabelArea
 *
 * @example
 * ScrollableLabelArea({
 *   text: "The quick brown fox jumps over the lazy dog.",
 *   width: 200,
 *   scrollFriction: 2,
 * })
 * .addChildTo(this);
 *
 * @param {object} [options] - The optional setup parameters. phina.ui.LabelAreaパラメータも有効です。
 * @param {number} [options.scrollFriction=0.86] - ドラッグスクロール時の摩擦係数を設定します。
 * @param {number} [options.scrollSpeed=3] - スクロールの感度・速度を指定します。
 * @param {number} [options.autoScroll=false] - 自動スクロールします。
 * @param {number} [options.limitScroll=true] - スクロール下限制限を有効にします。
 */
export default phina.createClass({
  superClass: phina.ui.LabelArea,

  init: function(options) {
    options = ({}).$extend({
      scrollFriction: 0.86,
      scrollSpeed: 3,
      autoScroll: false,
      limitScroll: true,
    }, options);
    this.superInit(options);
    this._scrollFriction = options.scrollFriction;
    this._scrollSpeed = options.scrollSpeed;
    this._limitScroll = options.limitScroll;

    this._setupScroll(options.autoScroll);
  },

  /**
   * @private
   * @instance
   * @memberof phina.ui.ScrollableLabelArea
   *
   * @param {boolean} autoScroll - [description]
   * @return {void} - [description]
   */
  _setupScroll: function(autoScroll) {
    var self = this;
    var velocity = 0;

    if (!autoScroll) {
      /* user drag scroll */
      this.setInteractive(true);
      this.on('pointstart', (e) => {
        velocity = 0;
      });
      this.on('pointmove', (e) => {
        velocity = e.pointer.dy * this._scrollSpeed;
      });
      this.on('enterframe', () => {
        if (velocity !== 0) {
          velocity *= this._scrollFriction;
          var maxScrollableY = Math.max(0, this.textAreaHeight + this.padding - this.canvasHeight);
          var nextY = this.scrollY - velocity;
          this.scrollY = (!this._limitScroll) ? nextY : Math.clamp(nextY, 0, maxScrollableY);
          velocity = (velocity.abs() < MIN_VELOCITY) ? 0 : velocity;
        }
      });

      // this.on('pointend', function(e) {
      //   physical.force(0, lastForce + lastMove);
      // });
      // this.on('pointmove', (e)=> {
      //   var maxScrollableY = Math.max(0, this.textAreaHeight - this.canvasHeight + this.padding);
      //   this.scrollY = Math.clamp(this.scrollY - e.pointer.dy, 0, maxScrollableY);
      // });
    } else {
      /* auto-scroll */
      this.on('enterframe', () => {
        var maxScrollableY = Math.max(0, this.textAreaHeight - this.canvasHeight + this.padding);
        var nextY = this.scrollY + this._scrollSpeed;
        // this.scrollY = Math.clamp(nextY, 0, maxScrollableY);
        this.scrollY = (!this._limitScroll) ? nextY : Math.clamp(nextY, 0, maxScrollableY);
        // this.scrollY = this.scrollY + velocity;
      });
    }
  },

  /**
   * 改行付きで文を追加
   * @instance
   * @memberof phina.ui.ScrollableLabelArea
   *
   * @param {string} line
   * @return {this} - return instance
   */
  addLine: function(line) {
    this.text += "\n"+line;
    return this;
  },

  _accessor: {

    /**
     * エリアのheightを返します。
     *
     * @instance
     * @memberof phina.ui.ScrollableLabelArea
     * @member {number}
     * @readonly
     */
    textAreaHeight: {
      get: function() {
        // var fakeTextHeight = this.canvas.context.measureText('M').width;
        // return this.getLines().length * fakeTextHeight;
        return this.getLines().length * this.lineSize; // 注：lineSizeは行の高さだが大雑把
      }
    },

    /**
     * canvas本体のheightを返します。
     *
     * @instance
     * @memberof phina.ui.ScrollableLabelArea
     * @member {number}
     * @readonly
     */
    canvasHeight: {
      get: function () { return this.calcCanvasHeight(); },
    },
  },

});