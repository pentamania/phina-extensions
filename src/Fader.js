/* global phina:false */
var Flow = phina.util.Flow;

/**
 * 対象をフェードイン・フェードアウトさせるアニメーションを設定します。
 * @class phina.accessory.Fader
 * @memberOf phina.accessory
 * @extends phina.accessory.Accessory
 *
 * @example
 * // 対象にattach
 * const gameStartLabel = Label("Game Start").addChildTo(this);
 * const fader = Fader().attachTo(gameStartLabel);
 *
 * // 明滅させる
 * fader.pulse()
 *
 * @param  {object} [options] - アニメーション設定オプション
 *   @param  {number} [options.duration=880] - アニメーション持続時間
 *   @param  {string} [options.easing=easeOutCubic] - アニメーションのイージング
 */
export default phina.createClass({
  superClass: phina.accessory.Accessory,

  init: function(options) {
    this.superInit();
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
   * 対象をフェードインさせます。
   * 完全に表示されるとfadeinイベントを実行します。
   * @instance
   * @memberOf phina.accessory.Fader
   *
   * @returns {phina.util.Flow} - Flow(Promise)を返します。
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
   * 対象をフェードアウトさせます。
   * 完全に消えたときにfadeoutイベントを実行します。
   * @instance
   * @memberOf phina.accessory.Fader
   *
   * @returns {phina.util.Flow} - Flow(Promise)を返します。
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
   * 状態に応じてshowもしくはhideを実行します。
   * @instance
   * @memberOf phina.accessory.Fader
   *
   * @returns {phina.util.Flow} - Flow(Promise)を返します。
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

  /**
   * 対象を明滅させます。
   * @instance
   * @memberOf phina.accessory.Fader
   *
   * @returns {void}
   */
  pulse: function() {
    this.target.alpha = 1.0;
    this._targetTweener.clear()
      .setLoop(true)
      .to({alpha:0}, this.duration, this.easing)
      .to({alpha:1}, this.duration, this.easing)
  },

});