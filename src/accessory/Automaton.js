/* global phina:false */

/**
 * @typedef {Object} StateObject
 * @property {function} [enter] - 状態が変わった際に実行する処理
 * @property {function} [update] - 毎フレーム実行する処理
 */

/**
 * @experimental
 * FSMの概念を実装したクラス。
 * あらかじめセットしたstateオブジェクトに応じてtargetに特定の振る舞いをさせる
 * @see http://www.lancarse.co.jp/blog/?p=1039
 *
 * @class phina.accessory.Automaton
 * @memberOf phina.accessory
 * @extends phina.accessory.Accessory
 *
 * @example
 * import { Automaton } from '@pentamania/phina-extensions';
 * // or const Automaton = phina.accessory.Automaton;
 *
 * phina.define('Enemy', {
 *   superClass: phina.display.Sprite,
 *   init: function() {
 *     this.superInit("enemyImage");
 *     const automaton = Automaton().attachTo(this)
 *       .registerState('search', {
 *         enter: function() {
 *           // 状態を切り替えたときに見た目を変更する
 *           this.setFrameIndex(0);
 *         },
 *         update: function(app) {
 *           // うろつく処理…
 *           if (プレイヤーを見つけた) {
 *             // 状態を変更する際は状態文字列を返す
 *             return 'chase';
 *           }
 *         },
 *       })
 *       .registerState('chase', {
 *         enter: function() {
 *           this.setFrameIndex(1);
 *         },
 *         update: function(app) {
 *           // プレイヤーを追っかける処理
 *           if (プレイヤーを見失った) {
 *             return 'search';
 *           }
 *         },
 *       })
 *     ;
 *     // 初期状態
 *     automaton.setState('search');
 *   },
 * });
 */
export default phina.createClass({
  superClass: phina.accessory.Accessory,

  init: function() {
    this.superInit();
    this._stateList = {};
    this._currentStateLabel = null;
  },

  update: function(app) {
    const currentState = this._getState(this._currentStateLabel);
    if (!currentState) {
      // warnする？
      return;
    }

    // const nextState = currentState.update(this.target, app);
    const nextState = currentState.update.call(this.target, app);
    if (nextState && nextState !== this._currentStateLabel) {
      // this._getState(nextState).enter(this.target, app);
      this._getState(nextState).enter.call(this.target, app);
      this._currentStateLabel = nextState;
    }
  },

  _getState: function(stateLabel) {
    return this._stateList[stateLabel];
  },

  /**
   * @instance
   * @param {string|symbol} stateLabel - 状態を示すラベル
   * @return {this} - chainable
   */
  setState: function(stateLabel) {
    this._currentStateLabel = stateLabel;
    return this;
  },

  /**
   * @instance
   * @param {string|symbol} stateLabel - 状態を示すラベル
   * @param {StateObject} stateObject - 状態オブジェクト
   * @return {this} - chainable
   */
  registerState: function(stateLabel, stateObject) {
    /* stateObjectをそのまま渡す */
    this._stateList[stateLabel] = stateObject;

    // /* パターン２：actorStateをphina class(function)で定義する場合 */
    // if (typeof actorState !== 'function') {
    //   // 文字列で渡された
    //   actorState = phina.using(actorState);
    // }
    // if (!actorState) {
    //   console.error('[phina-extensions]: 存在しないステートです')
    // }
    // this._stateList[stateLabel] = new actorState();

    return this;
  },

});
