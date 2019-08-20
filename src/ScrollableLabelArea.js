/* global phina:false */

var MIN_VELOCITY = 0.1;

/**
 * @typedef {Object} OptionParams
 * @property {number} scrollFriction? - break coeffient for drag scroll
 * @property {number} scrollSpeed? - speed of scroll
 * @property {boolean} autoScroll? -
 * @property {boolean|number} limitScroll? -
*/

/**
 * @class phina.ui.ScrollableLabelArea
 * スクロール可能なLabelArea
 * TODO: 最大スクロール可能位置をキャッシュ・設定する方法
 * @param {OptionParams} options
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
   * 後から文追加
   * @param {[type]} line [description]
   */
  addLine: function(line) {
    if (!line) line = "";
    this.text += "\n"+line;
    return this;
  },

  _accessor: {
    textAreaHeight: {
      get: function() {
        // var fakeTextHeight = this.canvas.context.measureText('M').width;
        // return this.getLines().length * fakeTextHeight;
        return this.getLines().length * this.lineSize; // 注：lineSizeは行の高さだが大雑把
      }
    },
    canvasHeight: {
      get: function () { return this.calcCanvasHeight(); },
    },
  },

});