"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _Animation = require("./Animation.types");
Object.keys(_Animation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Animation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Animation[key];
    }
  });
});
var _AnimationContext = require("./AnimationContext");
Object.keys(_AnimationContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AnimationContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AnimationContext[key];
    }
  });
});
var _AnimationProvider = require("./AnimationProvider");
Object.keys(_AnimationProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AnimationProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AnimationProvider[key];
    }
  });
});
var _useSkipAnimation = require("./useSkipAnimation");
Object.keys(_useSkipAnimation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useSkipAnimation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useSkipAnimation[key];
    }
  });
});