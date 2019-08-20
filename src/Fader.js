/* global phina:false */
var Flow = phina.util.Flow;

/**
 * @typedef {Object} OptionParam
 * @property {number} duration? - duration of fading
 * @property {string} easing? - Type of easing
 */

/**
 * @class phina.accessory.Fader
 * @memberOf phina
 * @param  {OptionParam} options
 * @param  {Object} target
 */
export default phina.createClass({
  superClass: phina.accessory.Accessory,

  init: function(options, target) {
    if (target) {
      this.superInit(target);
    } else {
      this.superInit();
    }
    options = ({}).$extend({
      duration: 880,
      easing: 'easeOutCubic',
    }, options);
    this.duration = options.duration;
    this.easing = options.easing;

    this._isShowing = true;
    this._targetTweener = phina.accessory.Tweener();
    this.on('attached', function() {
      this._targetTweener.attachTo(this.target);
    })
  },

  /**
   * @returns {phina.util.Flow}
   */
  show: function() {
    this._isShowing = true;
    var self = this;
    return Flow(function(resolve) {
      self._targetTweener.clear()
        .to({alpha:1.0}, self.duration, self.easing)
        .call(function() {
          self.flare('fadein');
          resolve();
        })
    })
  },

  /**
   * @returns {phina.util.Flow}
   */
  hide: function() {
    this._isShowing = false;
    var self = this;
    return Flow(function(resolve) {
      self._targetTweener.clear()
        .to({alpha:0}, self.duration, self.easing)
        .call(function() {
          self.flare('fadeout');
          resolve();
        })
    })
  },

  /**
   * @returns {phina.util.Flow}
   */
  toggle: function() {
    var flow;
    if (this._isShowing) {
      flow = this.hide();
    } else {
      flow = this.show();
    }
    return flow;
  },

  pulse: function() {
    this.target.alpha = 1.0;
    this._targetTweener.clear()
      .setLoop(true)
      .to({alpha:0}, this.duration, this.easing)
      // .call(function() {
      //   this.flare('fadeout');
      // }.bind(this))
      .to({alpha:1}, this.duration, this.easing)
  },

});