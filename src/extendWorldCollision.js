/**
 * Enables phina.app.Object2D inherited Class the methods related to world-coordinate postion and collision.
 * exends phina.app.Object2D.prototype
 * WIP
 */

var EXTENDED_METHODS = [
  /**
   * phina.app.Object2D.prototype.getWorldPosition
   * @param {boolean} useCache - ワールド座標の再計算をしない
   * @return {phina.geom.Vector2} 自身のワールド座標を返す
   */
  {
    name: "getWorldPosition",
    func: function(useCache=false) {
      var wm = (useCache) ? this._worldMatrix : this._calcWorldMatrix()._worldMatrix;
      return phina.geom.Vector2(wm.m02, wm.m12);
    }
  },

  /**
   * [getWorldCircle description]
   * @return {phina.geom.Circle} 自身のワールド円形判定を返す
   */
  {
    name: "getWorldCircle",
    func: function(useCache=false) {
      var wm = (useCache) ? this._worldMatrix : this._calcWorldMatrix()._worldMatrix;
      return phina.geom.Circle(wm.m02, wm.m12, this.radius);
    }
  },

  /**
   * [getWorldRect description]
   * @return {phina.geom.Rect} 自身のワールド座標上の矩形判定を返す
   */
  {
    name: "getWorldRect",
    func: function(useCache=false) {
      var wm = (useCache) ? this._worldMatrix : this._calcWorldMatrix()._worldMatrix;
      return phina.geom.Rect(wm.m02, wm.m12, this.width, this.height);
    }
  },

  /**
   * needs tests
   * @return {boolean}
   */
  {
    name: "hitTestWorld",
    func: function(useCache=false) {
      if (this.boundingType === 'rect') {
        // rect vs ...
        const thisHitRect = this.getWorldRect(useCache);
        switch (target.boundingType) {
          case 'rect':
            return phina.geom.Collision.testRectRect(thisHitRect, target.getWorldRect(useCache))
            break;
          case 'circle':
            return phina.geom.Collision.testCircleRect(target.getWorldCircle(useCache), thisHitRect);
            break;
        }
      } else {
        // circle vs ...
        const thisHitCircle = this.getWorldCircle(useCache);
        switch (target.boundingType) {
          case 'rect':
            return phina.geom.Collision.testCircleRect(target.getWorldRect(useCache), thisHitCircle);
            break;
          case 'circle':
            return phina.geom.Collision.testCircleCircle(thisHitCircle, target.getWorldCircle(useCache))
            break;
        }
      }
    }
  },
];

// phina.app.Object2D.prototype.getWorldPosition = function() {
//   var wm = this._calcWorldMatrix()._worldMatrix;
//   return phina.geom.Vector2(wm.m02, wm.m12);
// };

// phina.app.Object2D.prototype.getWorldCircle = function() {
//   // var wm = this._calcWorldMatrix()._worldMatrix; //thisがreturnされない時がある
//   // this._calcWorldMatrix();
//   var wm = this._worldMatrix;
//   return phina.geom.Circle(wm.m02, wm.m12, this.radius);
// };

// phina.app.Object2D.prototype.getWorldRect = function() {
//   var wm = this._calcWorldMatrix()._worldMatrix;
//   return phina.geom.Rect(wm.m02, wm.m12, this.width, this.height);
// };

// phina.app.Object2D.prototype.hitTestWorldCircle = function(target) {
//   var thisWorldCirc = this.getWorldCircle();
//   var targetWorldCirc = target.getWorldCircle();
//   return phina.geom.Collision.testCircleCircle(thisWorldCirc, targetWorldCirc)
// };

// phina.app.Object2D.prototype.hitTestCircleRecursive = function(target, func) {
//   if (this.hitTestWorldCircle(target)) {
//     func();
//   };
//   if (target.children) {
//     target.children.forEach(function(child){
//       this.hitTestCircleRecursive(child, func);
//     }.bind(this));
//   }
// };

export default function() {
  EXTENDED_METHODS.forEach(function(data) {
    phina.app.Object2D.prototype[data.name] = data.func;
  });

  // add accessor
  // @caveats World position is updated during the draw method, so it does'nt always return the exact position
  phina.app.Object2D.prototype.getter("wx", function() {
    return this._worldMatrix.m02;
  });
  phina.app.Object2D.prototype.getter("wy", function() {
    return this._worldMatrix.m12;
  });

}