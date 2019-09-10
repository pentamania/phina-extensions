/* global phina:false */

/**
 * @typedef {Object} SceneItem
 * @property {string} label
 * @property {string|function} className -
 * @property {Object} arguments -
 */

// ManagerScene拡張：classNameパラメータにcreateClass由来のfunctionも許容する
phina.game.ManagerScene.prototype.gotoScene = function(label, args) {
  var index = (typeof label == 'string') ? this.labelToIndex(label) : label||0;

  var data = this.scenes[index];

  if (!data) {
    console.error('phina.js error: `{0}` に対応するシーンがありません.'.format(label));
  }

  // change start---
  var klass;
  if (typeof data.className === 'string') {
    klass = phina.using(data.className);
    if (typeof klass !== 'function') {
      klass = phina.using('phina.game.' + data.className);
    }
  } else if (typeof data.className === 'function') {
    klass = data.className;
  } else {
    console.error("[phina.js]: className should be string or function");
  }
  // --- change end

  var initArguments = {}.$extend(data.arguments, args);
  var scene = klass.call(null, initArguments);
  if (!scene.nextLabel) {
      scene.nextLabel = data.nextLabel;
  }
  if (!scene.nextArguments) {
      scene.nextArguments = data.nextArguments;
  }
  this.app.pushScene(scene);

  this.sceneIndex = index;

  return this;
};


/**
 * ManagerSceneクラスをラップして簡略化。<br>
 * appのscenesオプションとして渡される前提<br>
 * 仮なので変更される可能性大。
 * @class phina.game.Sequence
 * @memberOf phina.game
 * @extends phina.game.ManagerScene
 *
 * @example
 * // create sequence
 * phina.define("MainSequence", {
 *   superClass: phina.game.Sequence,
 *   init: function(options) {
 *     this.superInit(options, [
 *       {
 *         label: "stage_999",
 *         className: "actionScene",
 *         arguments: {
 *           stageId: 999
 *         },
 *       },
 *       // ...other scene/sequence
 *     ])
 *   }
 * });
 *
 * // main
 * var app = phina.game.GameApp({
 *  width: SCREEN_WIDTH,
 *  height: SCREEN_HEIGHT,
 *  startLabel: "mainSeq"
 *  scenes: [
 *     {
 *       label: "mainSeq",
 *       className: 'MainSequence',
 *       // arguments: {} // 独自にoptions渡したい場合
 *     }
 *     // ...other scene/sequence
 *   ]
 * });
 *
 * @param {object} options - appのオプションが渡される（arguments未指定の場合）
 * @param {SceneItem[]} scenes - sceneクラス配列
 */
export default phina.createClass({
  superClass: phina.game.ManagerScene,

  init: function(options, scenes) {
    // argumentsがなければ親Sequence(Scene)の受けたパラメータをそのままバケツリレー
    // 主にwidthなどのappパラメータ受け渡しなどに使用
    scenes.forEach(function(scene) {
      scene.arguments = scene.arguments || options;
    });
    this.superInit({
      scenes: scenes
    });
  },

  /* scenesラストのシーンでexitした際 */
  onfinish: function() {
    this.exit(); // sequence自体を抜け、メインシーケンスに戻る
  },
});