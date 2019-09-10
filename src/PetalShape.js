// 他のShapeのようにphina.graphics.Canvasに描画処理を拡張しない
const _petalPath = function(x, y, radius) {
  var context = this.context;
  var p0 = {x: 0, y: radius * 0.5},
      cp1 = {x: -radius * 0.7, y: 0 },
      p1 = {x: -radius * 0.3, y: -radius },
      p2 = {x: 0, y: -radius * 0.55 },
      p3 = {x: radius * 0.3, y: -radius },
      cp2 = {x: radius * 0.7, y: 0 }
  ;

  context.beginPath();
  context.moveTo(p0.x, p0.y) // to start
  context.quadraticCurveTo(cp1.x, cp1.y, p1.x, p1.y)  // to notch left-end
  context.lineTo(p2.x, p2.y) // to notch middle
  context.lineTo(p3.x, p3.y) // to notch right-end
  context.quadraticCurveTo(cp2.x, cp2.y, p0.x, p0.y)  // back to start
  context.closePath();

  return this;
};

const DEFAULT_PARAMS = {
  backgroundColor: 'transparent',
  fill: '#F8BFF3',
  stroke: '#CD58D7',
  radius: 64,
}

/**
 * 花びら型のShapeクラスを描画します。
 * @class phina.display.PetalShape
 * @memberOf phina.display
 * @extends phina.display.Shape
 *
 * @example
 * PetalShape() // or phina.display.PetalShape()
 *   .addChildTo(this)
 *
 * @param {object} options - phina.display.Shapeを継承
 */
export default phina.createClass({
  superClass: phina.display.Shape,

  init: function(options) {
    options = ({}).$safe(options, DEFAULT_PARAMS);
    this.superInit(options);
    this.setBoundingType('circle');
  },

  prerender: function(canvas) {
    _petalPath.call(canvas, 0, 0, this.radius)
  },

  _static: {
    defaults: DEFAULT_PARAMS,
  },

});
