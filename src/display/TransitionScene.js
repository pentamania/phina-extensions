/* global phina:false */

const DEFAULT_PARAMS = {
  autoOpen: true,
}

/**
 * enter/exit時にトランジションエフェクトを付けるためのScene。継承してopenとcloseメソッドを書き換えて使用する<br>
 * また、ManagerScene管理下の子sceneとして使うことが前提。<br>
 * 名前はcocos2d-xの同クラスから
 * https://cocos2d-x.org/reference/native-cpp/V3.0alpha0/dc/ded/classcocos2d_1_1_transition_scene.html
 *
 * @class phina.display.TransitionScene
 * @memberOf phina.display
 * @extends phina.display.DisplayScene
 *
 * @example
 * import {TransitionScene} from '@pentamania/phina-extensions'
 * // const TransitionScene = phina.display.TransitionScene;// browser ver.
 *
 * phina.define('FadingScene', {
 *   superClass: TransitionScene,
 *
 *   init: function() {
 *     this.superInit({
 *       width: 320,
 *       height: 240,
 *     });
 *
 *     this.veil = phina.display.RectangleShape({
 *       width: this.width,
 *       height: this.height,
 *     }).addChildTo(this);
 *
 *     if (youWantToExitScene) {
 *       this.exit()
 *     }
 *   },
 *
 *   // 通常はenterイベントで自動実行
 *   open: function() {
 *     this.veil.tweener.clear()
 *     .to({alpha: 0});
 *   },
 *
 *   close: function(resolve) {
 *     this.veil.tweener.clear()
 *     .to({alpha: 1})
 *     .call(resolve);
 *   },
 *
 * })
 *
 * @param {object} options - extends phina.display.DisplayScene parameters
 * @param {number} [options.autoOpen=true] - シーン遷移の際、自動でopenを実行するかどう
 */
export default phina.createClass({
  superClass: phina.display.DisplayScene,

  init(options) {
    options = ({}).$safe(options, DEFAULT_PARAMS);
    this.superInit(options);

    this._isExiting = false;
    if (options.autoOpen) {
      this.one('enter', this.open.bind(this));
    }
  },

  /**
   * Sceneに入った際の処理<br>
   * ユーザーでオーバーライドして使用
   * @virtual
   * @instance
   * @memberof phina.display.TransitionScene
   */
  open() { },

  /**
   * Sceneを出る際の処理。exit()により実行される<br>
   * ユーザーでオーバーライドして使用<br>
   * 終わりの際はresolveを実行することを推奨
   * @virtual
   * @instance
   *
   * @param  {function} resolve - 処理終わりの際に実行
   * @memberof phina.display.TransitionScene
   */
  close(resolve) { resolve(); },

  /**
   * closeメソッドをexecutorとして受け取ったFlowを返す
   * @private
   * @instance
   * @memberof phina.display.TransitionScene
   *
   * @return {phina.util.Flow}
   */
  _close() {
    return phina.util.Flow(this.close.bind(this));
  },

  /**
   * 元の処理をオーバーライドしているが、使い方は同じ
   * @override
   * @instance
   * @memberof phina.display.TransitionScene
   *
   * @param  {string} nextLabel
   * @param  {any} nextArguments
   * @return {this}
   */
  exit(nextLabel, nextArguments) {
    if (!this.app) return;
    if (this._isExiting) return;

    // 閉じてる最中はexitを実行しないように
    this._isExiting = true;

    if (arguments.length > 0) {
      if (typeof arguments[0] === 'object') {
        nextLabel = arguments[0].nextLabel || this.nextLabel;
        nextArguments = arguments[0];
      }
      this.nextLabel = nextLabel;
      this.nextArguments = nextArguments;
    }

    // close処理が終わったら
    var closeResult = this._close();
    if (closeResult && closeResult.then) {
      closeResult.then(function() {
        this._isExiting = false;
        this.app.popScene();
        // this.superMethod('exit', nextLabel, nextArguments);
      }.bind(this));
    } else {
      // _close()がflowを返さなかった場合は即座にシーン移動
      this._isExiting = false;
      this.app.popScene();
    }

    return this;
  },

  _static: {
    defaults: DEFAULT_PARAMS,
  }

});