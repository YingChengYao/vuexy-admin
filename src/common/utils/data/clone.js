// 深拷贝
export function clone(obj) {
  var o;
  // 如果  他是对象object的话  , 因为null,object,array  也是'object';
  if (typeof obj === "object") {
    // 如果  他是空的话
    if (obj === null) {
      o = null;
    } else {
      // 如果  他是数组arr的话
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]));
        }
      }
      // 如果  他是对象object的话
      else {
        o = {};
        for (var j in obj) {
          o[j] = clone(obj[j]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
}

// 深度拷贝函数
export function deepCopy(data) {
  var t = this.type(data),
    o,
    i,
    ni;
  if (t === "array") {
    o = [];
  } else if (t === "object") {
    o = {};
  } else {
    return data;
  }
  if (t === "array") {
    for (i = 0, ni = data.length; i < ni; i++) {
      o.push(this.deepCopy(data[i]));
    }
    return o;
  } else if (t === "object") {
    for (i in data) {
      o[i] = this.deepCopy(data[i]);
    }
    return o;
  }
}
function type(obj) {
  var toString = Object.prototype.toString;
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  return map[toString.call(obj)];
}
