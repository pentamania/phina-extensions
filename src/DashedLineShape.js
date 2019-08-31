/* global phina:false */

var DEFAULT_PARAMS = {
  segments: [5, 15],
  stroke: 'gray',
  strokeWidth: 4,
}

/**
 * @class phina.display.DashedLineShape
 * @memberOf phina.display
 * @extends phina.display.Shape
 *
 * @example
    DashedLineShape({
      width: this.width,
      segments: [10, 20, 30]
    })
      .setPosition(this.width*0.5, 100)
      .addChildTo(this)
    ;
 *
 * @param {object} options
 */
export default phina.createClass({
  superClass: phina.display.Shape,

  init: function(options) {
    options = ({}).$extend(DEFAULT_PARAMS, options);
    this.superInit(options);
    this.backgroundColor = 'transparent';
    this.segments = options.segments;
  },

  prerender: function(canvas) {
    var context = canvas.context;
    var wh = this.width * 0.5;

    context.beginPath();
    context.setLineDash(this.segments);
    context.moveTo(-wh, 0);
    context.lineTo(wh, 0);
  },

  _defined: function() {
    phina.display.Shape.watchRenderProperty.call(this, 'segments');
  },

  _static: {
    defaults: DEFAULT_PARAMS,
  }
});