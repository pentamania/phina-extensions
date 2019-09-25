
/**
 * 花描画path
 * thisはphina.graphics.Canvasインスタンス
 */
const flowerPath = function(x, y, radius, petalNum, petalWidth) {
  const degUnit = 360 / petalNum;
  const centerCircleRadius = radius * 0.12;
  const spr = radius * 0.2;
  const cpr = radius * 0.5;
  const tpr = radius;

  this.beginPath();

  // 中心円のパス
  this.circle(0, 0, centerCircleRadius).closePath();

  // 花弁のパス
  for (let i = 0; i < petalNum; i++) {

    // 角度
    const degree = degUnit * i;
    const baseAngle = degree * Math.DEG_TO_RAD;
    const c1Angle = (degree - petalWidth) * Math.DEG_TO_RAD;
    const c2Angle = (degree + petalWidth) * Math.DEG_TO_RAD;

    // 方角
    const vx = Math.cos(baseAngle);
    const vy = Math.sin(baseAngle);

    // 開始点
    const sx = vx * spr;
    const sy = vy * spr;

    // 二次曲線 制御点その1（往路）
    const cp1x = Math.cos(c1Angle) * cpr;
    const cp1y = Math.sin(c1Angle) * cpr;

    // 先端
    const tx = vx * tpr;
    const ty = vy * tpr;

    // 二次曲線 制御点その2（復路）
    const cp2x = Math.cos(c2Angle) * cpr;
    const cp2y = Math.sin(c2Angle) * cpr;

    // 描画
    this.moveTo(sx, sy)
      .quadraticCurveTo(cp1x, cp1y, tx, ty)
      .quadraticCurveTo(cp2x, cp2y, sx, sy)
      .closePath();
  }
};

const DEFAULT_PARAMS = {
  backgroundColor: 'transparent',
  fill: '#F1DA03',
  radius: 128,
  petalNum: 22,
  petalWidth: 16,
  lineJoin: 'miter',
  miterLimit: 12,
}

/**
 * 花の形状のShape class
 * @class phina.display.FlowerShape
 * @memberOf phina.display
 * @extends phina.display.Shape
 *
 * @example
 * import {FlowerShape} from '@pentamania/phina-extensions'
 *
 * const flower = FlowerShape({
 *   radius: 60,
 *   petalNum: 24,
 *   petalWidth: 12,
 * }).addChildTo(this)
 *
 * @param {object} options - extends phina.display.Shape parameters
 * @param {number} [options.petalNum=22] - 花びらの数
 * @param {number} [options.petalWidth=16] - 花びらの幅
 */
export default phina.createClass({
    superClass: phina.display.Shape,

    init: function(options) {
      options = ({}).$safe(options, DEFAULT_PARAMS);
      this.superInit(options);
      this.petalNum = options.petalNum;
      this.petalWidth = options.petalWidth;
      this.miterLimit = options.miterLimit;
      this.setBoundingType('circle');
    },

    prerender: function(canvas) {
      canvas.miterLimit = this.miterLimit;
      flowerPath.call(canvas, 0, 0, this.radius, this.petalNum, this.petalWidth);
    },

    _defined: function() {
      phina.display.Shape.watchRenderProperty.call(this, 'miterLimit');
      phina.display.Shape.watchRenderProperty.call(this, 'petalNum');
      phina.display.Shape.watchRenderProperty.call(this, 'petalWidth');
    },

    _static: {
      defaults: DEFAULT_PARAMS,
    },

});
