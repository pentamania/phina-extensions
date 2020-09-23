/**
 * phina classを ES2015 class相当に変換
 * @see https://qiita.com/Negiwine_jp/items/512248cce5d9274cbb83
 * 
 * @param {phinaclass} phinaClass 
 */
export default function toESClass(phinaClass) {
  const creator = function() {;
    phinaClass.prototype.init.apply(this, arguments);
  };
  creator.prototype = Object.create(phinaClass.prototype);
  creator.prototype.constructor = creator;
  return creator;
}
