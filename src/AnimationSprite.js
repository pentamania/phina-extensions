/* global phina:false */

/**
 * @class phina.display.AnimationSprite
 * @memberOf phina.display
 * @extends phina.display.Sprite
 *
 * @param {string|phina.asset.Texture|phina.graphics.Canvas} image
 * @param {string} [ss] - the key of the loaded spritesheet data
 */
export default phina.createClass({
  superClass: phina.display.Sprite,

  init: function(image, ss) {
    this.superInit(image);
    ss = (ss) ? ss : (typeof image === 'string') ? image : null;
    this.animation = phina.accessory.FrameAnimation(ss).attachTo(this);
  },

  /**
   * <pre>
   * アニメーションを設定＆再生
   * Set and play specifed animation
   * </pre>
   * @instance
   * @override
   * @memberof phina.display.AnimationSprite
   *
   * @param {string} animationType - 定義したアニメーションラベルを指定
   * @return {this}
   */
  setAnimation: function(animationType) {
    this.animation.gotoAndPlay(animationType);
    return this;
  },

});