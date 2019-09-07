/* global phina:false */

const DEFAULT_PARAMS = {
  stroke: "gray",
  strokeWidth: 3,
  fill: "white",
  fontSize: 16,
  updateEveryFrame: true,
}

/**
 * @class phina.ui.DebugLabel
 * @memberOf phina.ui
 * @extends phina.ui.LabelArea
 *
 * 指定したオブジェクトのプロパティ値を毎フレーム更新表示します。
 *
 * @example
 * DebugLabel({fill: 'red'})
 *   .subscribe(this.player, 'life')
 *   .subscribe(this.player, 'position')
 *   .setPosition(100, 100)
 *   .addChildTo(this)
 *
 * @param {opject} options - LabelAreaのoptionにupdateEveryFrame
 */
export default phina.createClass({
  superClass: phina.ui.LabelArea,

  init(options, updateEveryFrame=true) {
    options = ({}).$extend(DEFAULT_PARAMS, options);
    this.superInit(options);
    this.setOrigin(0, 0);
    this._targetProps = [];

    if (updateEveryFrame)
      this.on('enterframe', this.updateLabel)
  },

  /**
   * 追跡表示するパラメータを追加
   * @param {object} targetObj 対象オブジェクト
   * @param {string} propName  プロパティ名
   * @return {this}
   */
  subscribe(targetObj, propName) {
    this._targetProps.push({
      obj: targetObj,
      prop: propName,
    });
    return this;
  },

  /**
   * 追跡パラメータをクリア
   * @return {this}
   */
  clear() {
    this._targetProps.length = 0;
    return this;
  },

  /**
   * プロパティ表示を更新する
   * @return {void}
   */
  updateLabel() {
    let texts = [];
    this._targetProps.forEach((item)=> {
      const key = item.prop;
      let val = JSON.stringify(item.obj[key]);
      texts.push(key + ": " + val);
    });
    this.text = texts.join('\n');
  },

});