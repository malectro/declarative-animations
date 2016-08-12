module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ease = exports.easeInOut = exports.easeOut = exports.easeIn = undefined;
	exports.createAnimation = createAnimation;
	exports.animate = animate;
	exports.deanimate = deanimate;
	exports.update = update;
	exports.scale = scale;
	exports.constrain = constrain;
	exports.setAttributes = setAttributes;
	exports.createSvgElement = createSvgElement;
	exports.color = color;
	exports.tweenColors = tweenColors;

	var _bezierEasing = __webpack_require__(1);

	var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createAnimation(elements, options) {
	  var duration = elements.reduce(function (end, _ref) {
	    var frames = _ref.frames;
	    return Math.max(end, frames.reduce(function (max, _ref2) {
	      var time = _ref2.time;
	      var duration = _ref2.duration;
	      return Math.max(max, time + (duration || 0));
	    }, 0));
	  }, 0);
	  var theEnd = duration;

	  elements = elements.map(function (element) {
	    var frames = element.frames.map(function (frame, i) {
	      var nextFrame = element.frames[i + 1];

	      var duration = frame.duration;

	      if (duration === undefined) {
	        if (nextFrame) {
	          duration = nextFrame.time - frame.time;
	        } else {
	          duration = theEnd - frame.time;
	        }
	      }
	      var end = frame.time + duration;

	      return Object.assign({}, frame, {
	        duration: duration,
	        end: end
	      });
	    });

	    var start = frames.reduce(function (min, _ref3) {
	      var time = _ref3.time;
	      return Math.min(min, time);
	    }, Infinity);
	    var end = frames.reduce(function (max, _ref4) {
	      var end = _ref4.end;
	      return Math.max(max, end);
	    }, 0);

	    return Object.assign({}, element, {
	      frames: frames,
	      start: start,
	      end: end
	    });
	  });

	  return Object.assign({}, options, {
	    elements: elements,
	    duration: duration
	  });
	}

	var animations = new Set();

	var lastTime = 0;
	function animate(animation) {
	  animation = Object.assign({}, animation, {
	    start: lastTime,
	    end: lastTime + animation.duration
	  });
	  animations.add(animation);
	}

	function deanimate(animation) {
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = animation.elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var element = _step.value;

	      if (element.dom) {
	        svg.removeChild(element.dom);
	        element.dom = null;
	      }
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  animations.delete(animation);
	}

	function update(time) {
	  requestAnimationFrame(update);

	  var timeDelta = time - lastTime;
	  lastTime = time;

	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = animations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var animation = _step2.value;

	      if (animation.end >= time) {
	        (function () {
	          var animationTime = time - animation.start;
	          var _iteratorNormalCompletion3 = true;
	          var _didIteratorError3 = false;
	          var _iteratorError3 = undefined;

	          try {
	            for (var _iterator3 = animation.elements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	              var element = _step3.value;

	              var frame = element.frames.find(function (frame) {
	                return frame.time <= animationTime && frame.end >= animationTime;
	              });
	              if (!frame && element.dom) {
	                svg.removeChild(element.dom);
	                element.dom = null;
	              } else if (frame) {
	                if (!element.dom) {
	                  element.dom = element.create(document);
	                  svg.appendChild(element.dom);
	                }

	                if (frame.update) {
	                  var progress = (animationTime - frame.time) / frame.duration;
	                  frame.update(element.dom, progress);
	                }
	              }
	            }
	          } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                _iterator3.return();
	              }
	            } finally {
	              if (_didIteratorError3) {
	                throw _iteratorError3;
	              }
	            }
	          }
	        })();
	      } else if (!animation.freeze) {
	        deanimate(animation);
	      }
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }
	}

	function scale(val, from, to) {
	  return val * (to - from) + from;
	}

	function constrain(val, from) {
	  var to = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

	  if (val <= from) {
	    return 0;
	  }
	  if (val >= to) {
	    return 1;
	  }
	  return (val - from) / (to - from);
	}

	function setAttributes(element, attrs) {
	  for (var key in attrs) {
	    element.setAttribute(key, attrs[key]);
	  }
	}

	function createSvgElement(document, tagname) {
	  var attrs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var content = arguments[3];

	  var element = document.createElementNS('http://www.w3.org/2000/svg', tagname);
	  setAttributes(element, attrs);
	  if (content) {
	    element.textContent = content;
	  }
	  return element;
	}

	var basicColor = {
	  r: 0, g: 0, b: 0,

	  toString: function toString() {
	    var r = this.r;
	    var g = this.g;
	    var b = this.b;

	    return 'rgb(' + Math.floor(r) + ', ' + Math.floor(g) + ', ' + Math.floor(b) + ')';
	  },
	  add: function add(color) {
	    var r = this.r;
	    var g = this.g;
	    var b = this.b;

	    return Object.assign({}, this, {
	      r: r + color.r,
	      g: g + color.g,
	      b: b + color.b
	    });
	  },
	  subtract: function subtract(color) {
	    var r = this.r;
	    var g = this.g;
	    var b = this.b;

	    return Object.assign({}, this, {
	      r: r - color.r,
	      g: g - color.g,
	      b: b - color.b
	    });
	  },
	  scale: function scale(value) {
	    var r = this.r;
	    var g = this.g;
	    var b = this.b;

	    return Object.assign({}, this, {
	      r: r * value,
	      g: g * value,
	      b: b * value
	    });
	  }
	};
	function color(r, g, b) {
	  if (g === undefined && b === undefined) {
	    var hex = Math.floor(r);
	    r = hex >> 16 & 255;
	    g = hex >> 8 & 255;
	    b = hex & 255;
	  }
	  return Object.assign({}, basicColor, { r: r, g: g, b: b });
	}

	function tweenColors(progress, fromColor, toColor) {
	  return toColor.subtract(fromColor).scale(progress).add(fromColor);
	}

	var easeIn = exports.easeIn = (0, _bezierEasing2.default)(0.42, 0, 1, 1);
	var easeOut = exports.easeOut = (0, _bezierEasing2.default)(0, 0, 0.58, 1);
	var easeInOut = exports.easeInOut = (0, _bezierEasing2.default)(0.42, 0, 0.58, 1);
	var ease = exports.ease = (0, _bezierEasing2.default)(0.25, 0.1, 0.25, 1);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("bezier-easing");

/***/ }
/******/ ]);