"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ChartsSurface = require("./ChartsSurface");
Object.keys(_ChartsSurface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ChartsSurface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ChartsSurface[key];
    }
  });
});