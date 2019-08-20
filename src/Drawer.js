/* global phina:false */
var Flow = phina.util.Flow;

/**
 * @class phina.accessory.Drawer
 * targetを開いた状態と閉まった状態を指定してtweenerで切り替える
 * 名前は仮なので変えるかも
 * @see https://runstant.com/pentamania/projects/e73be2ef
 */
export default phina.createClass({
  superClass: phina.accessory.Accessory,

  init: function(options) {
    this.superInit();
    options = ({}).$extend({
      duration: 340,
      // easing: 'easeOutCubic',
      easing: "easeOutExpo",
      // easing: "Expo",
    }, options);
    this.duration = options.duration;
    this.easing = options.easing;
    this.hideProps = options.hideProps || phina.geom.Vector2(0, 0);
    this.showProps = options.showProps || phina.geom.Vector2(0, 0);

    this._isShowing = false;
    this._tweener = phina.accessory.Tweener();
    this.on('attached', function() {
      this._tweener.attachTo(this.target);
      this._tweener.set(this.hideProps);
      this._isShowing = false;
    });
  },

  /**
   * tweenerでshowPropsを設定。
   * 名前はopenにする？
   * flowではなくthisを返すようにする？
   * @return {phina.util.Flow}
   */
  show: function() {
    this._isShowing = true;
    var self = this;
    // var easing = "easeOut{0}".format(this.easing);
    var easing = this.easing;
    return Flow(function(resolve) {
      self._tweener.clear()
        .to(self.showProps, self.duration, easing)
        .call(function() {
          self.flare('show');
          resolve();
        })
    })
  },

  /**
   * tweenerでhidePropsを設定
   * 名前はcloseにする？
   * flowではなくthisを返すようにする？
   * @return {phina.util.Flow}
   */
  hide: function() {
    this._isShowing = false;
    var self = this;
    // var easing = "easeIn{0}".format(this.easing);
    var easing = this.easing;
    return Flow(function(resolve) {
      self._tweener.clear()
        .to(self.hideProps, self.duration, easing)
        .call(function() {
          self.flare('hide');
          resolve();
        })
    })
  },

  /**
   * フラグによってshow/hideを選択実行
   * @return {phina.util.Flow}
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

});