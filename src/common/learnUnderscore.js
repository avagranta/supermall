// 将所有方法添加到_对象上，再将该对象通过模块导出或者挂载到全局对象上
(function() {
  // 获取全局对象，对环境进行检测，分别考虑浏览器环境(window/self)、node环境(global)、Web Worker(self)、
  var root = (typeof self === 'object' && self.window === self && self) ||
             (typeof global === 'object' && global.global === global && global);
  
  // 定义_对象，既要支持函数式调用，又要支持对象式调用，因此定义为函数
  var _ = function(obj) {
    // 如果不是_的实例，则返回调用对象，该对象原型指向_.prototype
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // 使用chainResult函数包裹返回值
  var chainResult = function(instance, obj) {
    return instance._chain ? _.chain(obj) : obj;
  }

  // 使用_.value 返回最后的值
  _.prototype.value = function() {
    return this._wrapped;
  }

  // 使用链式调用, 要实现链式调用，需要让每个函数返回一个对象，并保存此次结果，因此用chainResult包裹，此外还需要用value方法最后将对象的值返回
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }

  // 判断是否是类数组
  var isArrayLike = function(collection) {
    var length = collection.length;
    return typeof length === 'number' && length >= 0;
  }

  // 获取_上的方法
  _.functions = function(obj) {
    var names = [];
    // 遍历键名，找到所有方法,存入names中
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // 判断是否是函数
  _.isFunction = function(obj) {
    if (Object.prototype.toString.call(obj) === '[object Function]')
      return true;
    else
      return false;
  }

  // 遍历方法
  _.each = function(obj, callback) {
    var length, i = 0;
    if (isArrayLike(obj)) {
      length = obj.length;
      for (; i < length; i++) {
        if (callback.call(obj[i], obj[i], i) === false) {
          break;
        }
      }
    } else {
      for (i in obj) {
        if (callback.call(obj[i], i) === false) {
          break;
        }
      }
    }
    return obj;
  }

  // 在mixin前添加自定义函数

  // log方法
  _.log = function(content) {
    console.log(content);
  }

  // reverse方法
  _.reverse = function(string) {
    return string.split('').reverse().join('');
  }

  // 防抖函数
  _.debounce = function debounce(func, delay) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    }
  }

  // 格式化时间戳
  _.formateDate = function formatDate(date, fmt) {
    //1.获取年份
    // y+ 1个或者多个y
    // y* 0个或者多个y
    // y？0个或者一个y
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _.padLeftZero(str));
      }
    }
    return fmt;
  }

  // 日期处理 
  _.padLeftZero = function padLeftZero(str) {
    return ('00' + str).substr(str.length);
  }

  // 将_构造函数上的方法复制到_.prototype上
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      // var func = _[name] = obj[name];
      var func = _[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        [].push.apply(args, arguments);
        // 修改前：return func.apply(_, args);
        // 修改后：
        return chainResult(this, func.apply(_, args));
      }
    })
    return _;
  }

  // 调用mixin
  _.mixin(_);

  // 挂载到全局对象上, 以及模块化导出
  if (typeof module != 'undefined') {
    module.exports = _;
  } else {
    root._ = _;
  }
})()

