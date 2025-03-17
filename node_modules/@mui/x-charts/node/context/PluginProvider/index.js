"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _PluginProvider = require("./PluginProvider");
Object.keys(_PluginProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _PluginProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PluginProvider[key];
    }
  });
});
var _Plugin = require("./Plugin.types");
Object.keys(_Plugin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Plugin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Plugin[key];
    }
  });
});
var _PluginContext = require("./PluginContext");
Object.keys(_PluginContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _PluginContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PluginContext[key];
    }
  });
});
var _ColorProcessor = require("./ColorProcessor.types");
Object.keys(_ColorProcessor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ColorProcessor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ColorProcessor[key];
    }
  });
});
var _SeriesFormatter = require("./SeriesFormatter.types");
Object.keys(_SeriesFormatter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SeriesFormatter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SeriesFormatter[key];
    }
  });
});
var _ExtremumGetter = require("./ExtremumGetter.types");
Object.keys(_ExtremumGetter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ExtremumGetter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ExtremumGetter[key];
    }
  });
});
var _useColorProcessor = require("./useColorProcessor");
Object.keys(_useColorProcessor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useColorProcessor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useColorProcessor[key];
    }
  });
});
var _useSeriesFormatter = require("./useSeriesFormatter");
Object.keys(_useSeriesFormatter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useSeriesFormatter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useSeriesFormatter[key];
    }
  });
});
var _useXExtremumGetter = require("./useXExtremumGetter");
Object.keys(_useXExtremumGetter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useXExtremumGetter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useXExtremumGetter[key];
    }
  });
});
var _useYExtremumGetter = require("./useYExtremumGetter");
Object.keys(_useYExtremumGetter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useYExtremumGetter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useYExtremumGetter[key];
    }
  });
});
var _useRadiusExtremumGetter = require("./useRadiusExtremumGetter");
Object.keys(_useRadiusExtremumGetter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useRadiusExtremumGetter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useRadiusExtremumGetter[key];
    }
  });
});
var _useRotationExtremumGetter = require("./useRotationExtremumGetter");
Object.keys(_useRotationExtremumGetter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useRotationExtremumGetter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useRotationExtremumGetter[key];
    }
  });
});