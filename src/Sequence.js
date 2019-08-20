/* global phina:false */

/**
 * @typedef {Object} SceneItem
 * @property {string} label
 * @property {string|function} className -
 * @property {Object} arguments -
 */

/**
 * ManagerScene拡張
 * classNameパラメータにcreateClass由来のfunctionも対応する
 */
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
 * @class phina.game.Sequence
 * ManagerSceneクラスをラップして簡略化
 * appのscenesオプションとして渡される前提
 *
 * @example
 * phina.define("MainSequence", {
 *   superClass: phina.game.Sequence,
 *   init: function(options) {
 *     this.superInit(options, [
 *       {
 *         label: "stage_999",
 *         className: SingleStageSequence,
 *         arguments: {
 *           stageId: 999
 *         },
 *       },
 *       ...other scene/sequence
 *     ])
 *   }
 * });
 *
 * var app = phina.game.GameApp({
 *  width: SCREEN_WIDTH,
 *  height: SCREEN_HEIGHT,
 *  startLabel: "mainSeq"
 *  scenes: [
 *     {
 *       label: "mainSeq",
 *       className: 'MainSequence',
 *       arguments: {} // 独自にoptions渡したい場合
 *     }
 *     ...other scene/sequence
 *   ]
 * });
 *
 * @param {object} options - appのオプションが渡される（arguments未指定の場合）
 * @param {sceneItem[]} scenes - sceneクラス配列
 */
// phina.define('phina.game.Sequence', {
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