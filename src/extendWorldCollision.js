////////
// Enables phina.app.Object2D inherited Class the methods related to world-coordinate postion and collision.
// TODO: test methods
////////

export var EXTENDED_METHODS = [
  // /**
  //  * template
  //  */
  // {
  //   name: "",
  //   func: function() {
  //   }
  // },

  /**
   * phina.app.Object2D.prototype.getWorldPosition
   * @param {boolean} useCache - ワールド座標の再計算をせず、計算済みの値を使うかどうか
   * @return {phina.geom.Vector2} 自身のワールド座標を返す
   */
  {
    name: "getWorldPosition",
    func: function(useCache=false) {
      var wm = (useCache === true) ? this._worldMatrix : this._calcWorldMatrix()._worldMatrix;
      return phina.geom.Vector2(wm.m02, wm.m12);
    }
  },

  /**
   * phina.app.Object2D.prototype.getWorldCircle
   * @param {boolean} useCache - ワールド座標の再計算をせず、計算済みの値を使うかどうか
   * @return {phina.geom.Circle} 自身のワールド座標上の円形判定を返す
   */
  {
    name: "getWorldCircle",
    func: function(useCache=false) {
      var wm = (useCache === true) ? this._worldMatrix : this._calcWorldMatrix()._worldMatrix;
      return phina.geom.Circle(wm.m02, wm.m12, this.radius);
    }
  },

  /**
   * phina.app.Object2D.prototype.getWorldRect
   * @param {boolean} useCache - ワールド座標の再計算をせず、計算済みの値を使うかどうか
   * @return {phina.geom.Rect} 自身のワールド座標上の矩形判定を返す
   */
  {
    name: "getWorldRect",
    func: function(useCache=false) {
      var wm = (useCache === true) ? this._worldMatrix : this._calcWorldMatrix()._worldMatrix;
      const left = wm.m02 - this.origin.x * this.width;
      const top = wm.m12 - this.origin.y * this.height;
      return phina.geom.Rect(left, top, this.width, this.height);
    }
  },

  /**
   * phina.app.Object2D.prototype.hitTestWorldPoint
   * @return {boolean} hittest result
   */
  {
    name: "hitTestWorldPoint",
    func: function(target) {
      let hitArea;
      if (this.boundingType === 'rect') {
        hitArea = this.getWorldRect();
      } else {
        hitArea = this.getWorldCircle();
      }
      return hitArea.contains(target.wx, target.wy);
    }
  },

  /**
   * phina.app.Object2D.prototype.hitTestWorldTarget
   * returns hittest using phina.geom.Collision
   * depends on boundingType
   * @return {boolean} hittest result
   */
  {
    name: "hitTestWorldTarget",
    func: function(target, useCache=true) {
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
      } else if (this.boundingType === 'circle') {
        // circle vs ...
        const thisHitCircle = this.getWorldCircle(useCache);
        switch (target.boundingType) {
          case 'rect':
            return phina.geom.Collision.testCircleRect(thisHitCircle, target.getWorldRect(useCache));
            break;
          case 'circle':
            return phina.geom.Collision.testCircleCircle(thisHitCircle, target.getWorldCircle(useCache))
            break;
        }
      }
    }
  },

  /**
   * phina.app.Object2D.prototype.hitTestRecursive
   * targetのchildrenまで下ってそれぞれコールバック処理を行う
   * 深さ優先探索
   * @params {function} success
   * @params {function} failure
   * @return {void}
   */
  {
    name: "hitTestRecursive",
    func: function(target, success, failure) {
      if (this.hitTestWorldTarget(target)) {
        success(target);
      } else {
        if (failure && typeof failure === 'function') failure(target);
      }
      if (target.children && target.children.length) {
        target.children.forEach((child)=> {
          this.hitTestRecursive(child, success, failure);
        });
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

/**
 * phina.extendWorldCollision
 *
 * @return {void}
 */
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