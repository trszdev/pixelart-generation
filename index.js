var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("canvas", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WrappedHtmlCanvas = /** @class */ (function () {
        function WrappedHtmlCanvas(canvas) {
            var _this = this;
            this.getWidth = function () { return _this.canvas.width; };
            this.getHeight = function () { return _this.canvas.height; };
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        }
        WrappedHtmlCanvas.prototype.fillRect = function (x, y, w, h, _a) {
            var _b = __read(_a, 4), r = _b[0], g = _b[1], b = _b[2], a = _b[3];
            this.ctx.clearRect(x, y, w, h);
            this.ctx.fillStyle = "rgba(" + [r, g, b, a / 255] + ")";
            this.ctx.fillRect(x, y, w, h);
        };
        WrappedHtmlCanvas.prototype.getPixel = function (x, y) {
            var imageData = this.ctx.getImageData(x, y, 1, 1).data;
            return Array.from(imageData);
        };
        WrappedHtmlCanvas.prototype.setPixel = function (x, y, color) {
            var imageData = this.ctx.getImageData(x, y, 1, 1);
            imageData.data[0] = color[0];
            imageData.data[1] = color[1];
            imageData.data[2] = color[2];
            imageData.data[3] = color[3];
            this.ctx.putImageData(imageData, x, y);
        };
        WrappedHtmlCanvas.prototype.getPixels = function () {
            var _a = this.canvas, width = _a.width, height = _a.height;
            var imageData = this.ctx.getImageData(0, 0, width, height).data;
            var rows = Array(height);
            var count = 0;
            for (var j = 0; j < height; j++) {
                var row = [];
                rows[j] = row;
                for (var i = 0; i < width; i++) {
                    var color = [0, 0, 0, 0];
                    color[0] = imageData[count++];
                    color[1] = imageData[count++];
                    color[2] = imageData[count++];
                    color[3] = imageData[count++];
                    row.push(color);
                }
            }
            return rows;
        };
        return WrappedHtmlCanvas;
    }());
    exports.default = WrappedHtmlCanvas;
});
define("dom", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dom = {
        canvasOrig: document.getElementById('canvas-orig'),
        canvasNn: document.getElementById('canvas-nn'),
        canvasGerstner: document.getElementById('canvas-gerstner'),
        progressNn: document.getElementById('progress-nn'),
        progressGerstner: document.getElementById('progress-gerstner'),
        paletteNn: document.getElementById('palette-nn'),
        paletteGerstner: document.getElementById('palette-gerstner'),
        gifGerstner: document.getElementById('gerstner-gif'),
        gifNn: document.getElementById('nn-gif'),
        pngGerstner: document.getElementById('gerstner-png'),
        pngNn: document.getElementById('nn-png'),
        nnFactor: document.getElementById('nn-factor'),
        nnColors: document.getElementById('nn-colors'),
        nnSubmit: document.getElementById('nn-submit'),
        gerstnerFactor: document.getElementById('gerstner-factor'),
        gerstnerColors: document.getElementById('gerstner-colors'),
        gerstnerSubmit: document.getElementById('gerstner-submit'),
        uploadInput: document.getElementById('upload'),
        submitTests: __spread(Array(12).keys()).map(function (i) { return document.getElementById("submit-test" + (i + 1)); }),
    };
    exports.saveAs = function (url, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = url;
        link.click();
    };
    exports.setProgress = function (node, val) {
        exports.clearChildren(node);
        if (val)
            node.appendChild(document.createTextNode("(Iteration: " + val + ")"));
    };
    exports.clearChildren = function (node) {
        while (node.firstChild)
            node.removeChild(node.firstChild);
    };
    exports.fillPalette = function (domPalette, palette) {
        exports.clearChildren(domPalette);
        var paletteCopy = palette.map(function (x) { return x; });
        var allUsage = paletteCopy.reduce(function (acc, x) { return acc + x.timesUsed; }, 0);
        paletteCopy.forEach(function (_a) {
            var u = _a.timesUsed, _b = __read(_a.color, 3), r = _b[0], g = _b[1], b = _b[2];
            var node = document.createElement('div');
            node.title = u ? "Usage " + Math.floor(u / allUsage * 10000) / 100 + "%" : "This color wasn't used";
            node.className = u ? 'color' : 'unused color';
            node.style.background = "rgb(" + [r, g, b] + ")";
            domPalette.appendChild(node);
        });
    };
    var ButtonProcess = /** @class */ (function () {
        function ButtonProcess(btn, running) {
            if (running === void 0) { running = false; }
            this.running = running;
            this.btn = btn;
        }
        ButtonProcess.prototype.tryFreeButton = function (force) {
            if (force === void 0) { force = false; }
            if (!force && this.running)
                return false;
            this.running = false;
            this.btn.value = 'Submit';
            this.btn.disabled = false;
            return true;
        };
        ButtonProcess.prototype.isCancelling = function () {
            if (this.running) {
                this.btn.disabled = true;
                this.running = false;
            }
            else {
                this.running = true;
                this.btn.value = 'Cancel';
            }
            return !this.running;
        };
        return ButtonProcess;
    }());
    exports.ButtonProcess = ButtonProcess;
});
define("util", ["require", "exports"], function (require, exports) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randInt = function (maxExclusive, minInclusive) {
        if (minInclusive === void 0) { minInclusive = 0; }
        return Math.floor((maxExclusive - minInclusive) * Math.random()) + minInclusive;
    };
    exports.wait = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (res) { return setTimeout(res, ms); })];
    }); }); };
    exports.clamp = function (val, min, max) { return Math.max(Math.min(max, val), min); };
    exports.floorColor = function (c) { return c.map(function (x) { return exports.clamp(Math.round(x), 0, 255); }); };
    exports.diff = function (from, what) { return from.map(function (x, i) { return x - what[i]; }); };
    exports.add = function (to, what) { return to.forEach(function (_, i) { return to[i] += what[i]; }); };
    exports.normSquare = function (v) { return v.reduce(function (acc, x) { return acc + x * x; }, 0); };
    exports.normEuclidian = function (v) { return Math.sqrt(exports.normSquare(v)); };
    exports.distSquare = function (from, to) { return exports.normSquare(exports.diff(from, to)); };
    exports.dist = function (from, to) { return exports.normEuclidian(exports.diff(from, to)); };
    exports.gaussian = function (r, sigma) { return (Math.exp(-(r * r) / sigma)) / (Math.PI * sigma); };
    exports.array1d = function (size, filler) {
        var result = Array(size);
        for (var x = 0; x < size; x++)
            result[x] = filler(x);
        return result;
    };
    exports.array2d = function (width, height, filler) {
        var result = Array(height);
        var _loop_1 = function (y) {
            result[y] = exports.array1d(width, function (x) { return filler(x, y); });
        };
        for (var y = 0; y < height; y++) {
            _loop_1(y);
        }
        return result;
    };
    exports.minWithIndex = function (v) {
        var _a = __read(v.reduce(function (_a, x, i) {
            var _b = __read(_a, 2), mi = _b[0], mx = _b[1];
            return mx > x ? [i, x] : [mi, mx];
        }, [-1, Number.MAX_VALUE]), 2), index = _a[0], val = _a[1];
        return { index: index, val: val };
    };
    /*
    color conversions are from https://github.com/antimatter15/rgb-lab/blob/master/color.js
    Lab ranges:
    {
      l: [ 0, 100 ],
      a: [ -86.1846364976253, 98.25421868616108 ],
      b: [ -107.8636810449517, 94.48248544644461 ]
    }
    */
    exports.scaledLab2rgb = function (lab) { return exports.lab2rgb([
        lab[0] * 0.39215686274509803,
        lab[1] * 0.7232896281717113 - 86.1846364976253,
        lab[2] * 0.7935143783976327 - 107.8636810449517,
    ]); };
    exports.lab2rgb = function (lab) {
        var y = (lab[0] + 16) / 116, x = lab[1] / 500 + y, z = y - lab[2] / 200, r, g, b;
        x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16 / 116) / 7.787);
        y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16 / 116) / 7.787);
        z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16 / 116) / 7.787);
        r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        b = x * 0.0557 + y * -0.2040 + z * 1.0570;
        r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : 12.92 * r;
        g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : 12.92 * g;
        b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : 12.92 * b;
        return exports.floorColor([
            exports.clamp(r, 0, 1) * 255,
            exports.clamp(g, 0, 1) * 255,
            exports.clamp(b, 0, 1) * 255,
        ]);
    };
    exports.rgb2lab = function (rgb) {
        var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
        y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
        z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
    };
});
define("gerstner", ["require", "exports", "util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // some kind of port https://github.com/fHachenberg/pix
    var GerstnerPixelArt = /** @class */ (function () {
        function GerstnerPixelArt() {
            var _this = this;
            this.slicTolerance = 45;
            this.smoothColorFactor = 4;
            this.smoothPosFactor = 0.87;
            this.laplaceFactor = 0.4;
            this.vec2idx = function (_a) {
                var _b = __read(_a, 2), x = _b[0], y = _b[1];
                return x + _this.outWidth * y;
            };
        }
        GerstnerPixelArt.fromImage = function (input, pixelSize, paletteSize, releaser, getMaxEigenFunc) {
            return __awaiter(this, void 0, void 0, function () {
                var result, weights, labPixels, firstColor, y, x, fc, _a, val, t;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            result = new GerstnerPixelArt();
                            weights = util_1.array2d(input[0].length, input.length, function () { return 1; });
                            labPixels = util_1.array2d(input[0].length, input.length, function (i, j) {
                                var _a = __read(input[j][i], 4), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                                weights[j][i] = a / 255;
                                return util_1.rgb2lab([r, g, b]);
                            });
                            result.height = input.length;
                            result.width = input[0].length;
                            result.releaser = releaser;
                            result.paletteSize = paletteSize;
                            result.getMaxEigenFunc = getMaxEigenFunc;
                            result.pixelSize = pixelSize;
                            result.outHeight = Math.ceil(result.height / pixelSize);
                            result.outWidth = Math.ceil(result.width / pixelSize);
                            result.slicRange = Math.sqrt((result.height / result.outHeight) * (result.width / result.outWidth));
                            result.paletteAt = util_1.array2d(result.outWidth, result.outHeight, function () { return 0; });
                            result.centroids = util_1.array2d(result.outWidth, result.outHeight, function (x, y) {
                                var i = ((x + .5) / result.outWidth * result.width);
                                var j = ((y + .5) / result.outHeight * result.height);
                                return [i, j];
                            });
                            result.input = labPixels;
                            result.inputWeights = weights;
                            result.regionMap = util_1.array2d(result.width, result.height, function (x, y) {
                                var i = Math.floor(x / result.width * result.outWidth);
                                var j = Math.floor(y / result.height * result.outHeight);
                                return [i, j];
                            });
                            result.superpixelColor = util_1.array2d(result.outWidth, result.outHeight, function () { return [0, 0, 0]; });
                            return [4 /*yield*/, result.updateSuperpixelMeans()];
                        case 1:
                            _b.sent();
                            firstColor = [0, 0, 0];
                            for (y = 0; y < result.outHeight; ++y) {
                                for (x = 0; x < result.outWidth; ++x)
                                    util_1.add(firstColor, result.superpixelColor[y][x]);
                            }
                            result.singleProbability = 1.0 / (result.outWidth * result.outHeight);
                            fc = firstColor.map(function (x) { return x * result.singleProbability; });
                            result.colorProbability = [0.5, 0.5];
                            result.superpixelColorProbability = [
                                util_1.array1d(result.outWidth * result.outHeight, function () { return 0.5; }),
                                util_1.array1d(result.outWidth * result.outHeight, function () { return 0.5; }),
                            ];
                            result.palette = [fc];
                            return [4 /*yield*/, result.getMaxEigen(0)];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), val = _a[0], t = _a[1];
                            util_1.add(val, fc);
                            result.palette.push(val);
                            result.colorPairs = [[0, 1]];
                            result.temperature = t;
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.getAveragedPalette = function () {
            var averagedPalette = JSON.parse(JSON.stringify(this.palette));
            if (this.paletteWasHuge)
                return averagedPalette;
            var _loop_2 = function (i) {
                var _a = __read(this_1.colorPairs[i], 2), index1 = _a[0], index2 = _a[1];
                var color1 = this_1.palette[index1];
                var color2 = this_1.palette[index2];
                var weight1 = this_1.colorProbability[index1];
                var weight2 = this_1.colorProbability[index2];
                var totalWeight = weight1 + weight2;
                weight1 /= totalWeight;
                weight2 /= totalWeight;
                var averagedColor = color1.map(function (c, i) { return c * weight1 + color2[i] * weight2; });
                averagedPalette[index1] = averagedColor;
                averagedPalette[index2] = averagedColor;
            };
            var this_1 = this;
            for (var i = 0; i < this.colorPairs.length; ++i) {
                _loop_2(i);
            }
            return averagedPalette;
        };
        GerstnerPixelArt.prototype.updateSuperPixelMapping = function () {
            return __awaiter(this, void 0, void 0, function () {
                var averagedPalette, distance, y, x, pos, minX, minY, maxX, maxY, superpixelColor, yy, xx, colorError, distError, error, y, x, i, j;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.regionMap = util_1.array2d(this.width, this.height, function () { return [-1, 0]; });
                            averagedPalette = this.getAveragedPalette();
                            distance = util_1.array2d(this.width, this.height, function () { return -5; });
                            y = 0;
                            _a.label = 1;
                        case 1:
                            if (!(y < this.outHeight)) return [3 /*break*/, 4];
                            for (x = 0; x < this.outWidth; ++x) {
                                pos = this.centroids[y][x];
                                minX = Math.max(0, Math.floor(pos[0] - this.slicRange));
                                minY = Math.max(0, Math.floor(pos[1] - this.slicRange));
                                maxX = Math.min(this.width - 1, pos[0] + this.slicRange);
                                maxY = Math.min(this.height - 1, pos[1] + this.slicRange);
                                superpixelColor = averagedPalette[this.paletteAt[y][x]];
                                for (yy = minY; yy <= maxY; ++yy) {
                                    for (xx = minX; xx <= maxX; ++xx) {
                                        colorError = util_1.dist(this.input[yy][xx], superpixelColor);
                                        distError = util_1.dist(pos, [xx, yy]) * this.slicTolerance;
                                        error = colorError + distError / this.slicRange;
                                        if (distance[yy][xx] < 0 || error < distance[yy][xx]) {
                                            distance[yy][xx] = error;
                                            this.regionMap[yy][xx] = [x, y];
                                        }
                                    }
                                }
                            }
                            return [4 /*yield*/, this.releaser.release()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++y;
                            return [3 /*break*/, 1];
                        case 4:
                            y = 0;
                            _a.label = 5;
                        case 5:
                            if (!(y < this.height)) return [3 /*break*/, 8];
                            for (x = 0; x < this.width; ++x) {
                                if (this.regionMap[y][x][0] === -1) {
                                    i = Math.floor(x / this.width * this.outWidth);
                                    j = Math.floor(y / this.height * this.outHeight);
                                    this.regionMap[y][x] = [i, j];
                                }
                            }
                            return [4 /*yield*/, this.releaser.release()];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            ++y;
                            return [3 /*break*/, 5];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.updateSuperpixelMeans = function () {
            return __awaiter(this, void 0, void 0, function () {
                var colorSums, posSums, weights, y, x, _a, sx, sy, totalWeight, y, _loop_3, this_2, x, y, x;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            colorSums = util_1.array2d(this.outWidth, this.outHeight, function () { return [0, 0, 0]; });
                            posSums = util_1.array2d(this.outWidth, this.outHeight, function () { return [0, 0]; });
                            weights = util_1.array2d(this.outWidth, this.outHeight, function () { return 0; });
                            this.superpixelWeight = util_1.array2d(this.outWidth, this.outHeight, function () { return 0; });
                            this.totalWeight = 0;
                            y = 0;
                            _b.label = 1;
                        case 1:
                            if (!(y < this.height)) return [3 /*break*/, 4];
                            for (x = 0; x < this.width; ++x) {
                                _a = __read(this.regionMap[y][x], 2), sx = _a[0], sy = _a[1];
                                util_1.add(colorSums[sy][sx], this.input[y][x]);
                                util_1.add(posSums[sy][sx], [x, y]);
                                weights[sy][sx]++;
                                this.superpixelWeight[sy][sx] += this.inputWeights[y][x];
                            }
                            return [4 /*yield*/, this.releaser.release()];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            ++y;
                            return [3 /*break*/, 1];
                        case 4:
                            totalWeight = 0;
                            y = 0;
                            _b.label = 5;
                        case 5:
                            if (!(y < this.outHeight)) return [3 /*break*/, 8];
                            _loop_3 = function (x) {
                                var w = weights[y][x];
                                if (w === 0) {
                                    var inputX = Math.floor(x / this_2.outWidth * this_2.width);
                                    var inputY = Math.floor(y / this_2.outHeight * this_2.height);
                                    this_2.superpixelColor[y][x] = this_2.input[inputY][inputX];
                                }
                                else {
                                    this_2.superpixelColor[y][x] = colorSums[y][x].map(function (c) { return c / w; });
                                    this_2.centroids[y][x] = posSums[y][x].map(function (p) { return p / w; });
                                    this_2.superpixelWeight[y][x] /= w;
                                    totalWeight += this_2.superpixelWeight[y][x];
                                }
                            };
                            this_2 = this;
                            for (x = 0; x < this.outWidth; ++x) {
                                _loop_3(x);
                            }
                            return [4 /*yield*/, this.releaser.release()];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            ++y;
                            return [3 /*break*/, 5];
                        case 8:
                            this.totalWeight = totalWeight;
                            for (y = 0; y < this.outHeight; ++y) {
                                for (x = 0; x < this.outWidth; ++x)
                                    this.superpixelWeight[y][x] /= totalWeight;
                            }
                            return [4 /*yield*/, this.smoothSuperpixelPositions()];
                        case 9:
                            _b.sent();
                            return [4 /*yield*/, this.smoothSuperpixelColors()];
                        case 10:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.smoothSuperpixelColors = function () {
            return __awaiter(this, void 0, void 0, function () {
                var newSuperpixelColors, i, _loop_4, this_3, j;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newSuperpixelColors = util_1.array2d(this.outWidth, this.outHeight, function () { return [0, 0, 0]; });
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.outWidth)) return [3 /*break*/, 4];
                            _loop_4 = function (j) {
                                var minX = Math.max(0, i - 1);
                                var maxX = Math.min(this_3.outWidth - 1, i + 1);
                                var minY = Math.max(0, j - 1);
                                var maxY = Math.min(this_3.outHeight - 1, j + 1);
                                var sum = [0, 0, 0];
                                var weight = 0;
                                var sc = this_3.superpixelColor[j][i];
                                for (var ii = minX; ii <= maxX; ++ii) {
                                    var _loop_5 = function (jj) {
                                        var centroid = this_3.superpixelColor[jj][ii];
                                        var colorMul = util_1.gaussian(util_1.dist(sc, centroid), this_3.smoothColorFactor);
                                        var posMul = util_1.gaussian(util_1.dist([i, j], [ii, jj]), this_3.smoothPosFactor);
                                        util_1.add(sum, centroid.map(function (x) { return x * colorMul * posMul; }));
                                        weight += colorMul * posMul;
                                    };
                                    for (var jj = minY; jj <= maxY; ++jj) {
                                        _loop_5(jj);
                                    }
                                }
                                newSuperpixelColors[j][i] = sum.map(function (x) { return x / weight; });
                            };
                            this_3 = this;
                            for (j = 0; j < this.outHeight; ++j) {
                                _loop_4(j);
                            }
                            return [4 /*yield*/, this.releaser.release()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4:
                            this.superpixelColor = newSuperpixelColors;
                            return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.associatePalette = function () {
            return __awaiter(this, void 0, void 0, function () {
                var newColorProbability, overT, _loop_6, this_4, y;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newColorProbability = util_1.array1d(this.palette.length, function () { return 0; });
                            this.superpixelColorProbability = util_1.array2d(this.outHeight * this.outWidth, this.palette.length, function () { return 0; });
                            overT = -1 / this.temperature;
                            _loop_6 = function (y) {
                                var _loop_7, x;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _loop_7 = function (x) {
                                                var probs = [];
                                                var pixel = this_4.superpixelColor[y][x];
                                                var probabilitySum = 0;
                                                var index = util_1.minWithIndex(this_4.palette.map(function (c, i) {
                                                    var colorError = util_1.dist(c, pixel);
                                                    var prob = _this.colorProbability[i] * Math.exp(colorError * overT);
                                                    probs.push(prob);
                                                    probabilitySum += prob;
                                                    return colorError;
                                                })).index;
                                                this_4.paletteAt[y][x] = index;
                                                var superpixelWeight = this_4.superpixelWeight[y][x];
                                                probs.forEach(function (p, i) {
                                                    var normalizedProb = p / probabilitySum;
                                                    _this.superpixelColorProbability[i][_this.vec2idx([x, y])] = normalizedProb;
                                                    newColorProbability[i] += superpixelWeight * normalizedProb;
                                                });
                                            };
                                            for (x = 0; x < this_4.outWidth; ++x) {
                                                _loop_7(x);
                                            }
                                            return [4 /*yield*/, this_4.releaser.release()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_4 = this;
                            y = 0;
                            _a.label = 1;
                        case 1:
                            if (!(y < this.outHeight)) return [3 /*break*/, 4];
                            return [5 /*yield**/, _loop_6(y)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++y;
                            return [3 /*break*/, 1];
                        case 4:
                            this.colorProbability = newColorProbability;
                            return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.smoothSuperpixelPositions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var newCentroids, i, j, sum, count, orig, nPos;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newCentroids = util_1.array2d(this.outWidth, this.outHeight, function () { return [0, 0]; });
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.outWidth)) return [3 /*break*/, 4];
                            for (j = 0; j < this.outHeight; ++j) {
                                sum = [0, 0];
                                count = 0;
                                if (i > 0) {
                                    util_1.add(sum, this.centroids[j][i - 1]);
                                    count++;
                                }
                                if (i < this.outWidth - 1) {
                                    util_1.add(sum, this.centroids[j][i + 1]);
                                    count++;
                                }
                                if (j > 0) {
                                    util_1.add(sum, this.centroids[j - 1][i]);
                                    count++;
                                }
                                if (j < this.outHeight - 1) {
                                    util_1.add(sum, this.centroids[j + 1][i]);
                                    count++;
                                }
                                sum[0] /= count;
                                sum[1] /= count;
                                orig = this.centroids[j][i];
                                nPos = [0, 0];
                                if (i === 0 || i === this.outWidth - 1) {
                                    nPos[0] = orig[0];
                                }
                                else {
                                    nPos[0] = (1.0 - this.laplaceFactor) * orig[0] + this.laplaceFactor * sum[0];
                                }
                                if (j === 0 || j === this.outHeight - 1) {
                                    nPos[1] = orig[1];
                                }
                                else {
                                    nPos[1] = (1.0 - this.laplaceFactor) * orig[1] + this.laplaceFactor * sum[1];
                                }
                                newCentroids[j][i] = nPos;
                            }
                            return [4 /*yield*/, this.releaser.release()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4:
                            this.centroids = newCentroids;
                            return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.refinePalette = function () {
            return __awaiter(this, void 0, void 0, function () {
                var colorSums, _loop_8, this_5, y, paletteError;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            colorSums = util_1.array1d(this.palette.length, function () { return [0, 0, 0]; });
                            _loop_8 = function (y) {
                                var _loop_9, x;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _loop_9 = function (x) {
                                                var superpixelWeight = this_5.superpixelWeight[y][x];
                                                var superpixelColor = this_5.superpixelColor[y][x];
                                                this_5.palette.forEach(function (_, i) {
                                                    var w = superpixelWeight * _this.superpixelColorProbability[i][_this.vec2idx([x, y])];
                                                    util_1.add(colorSums[i], superpixelColor.map(function (x) { return x * w; }));
                                                });
                                            };
                                            for (x = 0; x < this_5.outWidth; ++x) {
                                                _loop_9(x);
                                            }
                                            return [4 /*yield*/, this_5.releaser.release()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_5 = this;
                            y = 0;
                            _a.label = 1;
                        case 1:
                            if (!(y < this.outHeight)) return [3 /*break*/, 4];
                            return [5 /*yield**/, _loop_8(y)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++y;
                            return [3 /*break*/, 1];
                        case 4:
                            paletteError = 0;
                            this.palette.forEach(function (c, i) {
                                if (_this.colorProbability[i] > 0) {
                                    var newColor = colorSums[i].map(function (x) { return x / _this.colorProbability[i]; });
                                    paletteError += util_1.dist(c, newColor);
                                    _this.palette[i] = newColor;
                                }
                            });
                            return [2 /*return*/, paletteError];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.getMaxEigen = function (index) {
            return __awaiter(this, void 0, void 0, function () {
                var matrix, y, x, colorSuperpixelProbability, colorError, _a, vec, lambda, len;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            matrix = util_1.array1d(9, function () { return 0; });
                            y = 0;
                            _b.label = 1;
                        case 1:
                            if (!(y < this.outHeight)) return [3 /*break*/, 4];
                            for (x = 0; x < this.outWidth; ++x) {
                                colorSuperpixelProbability = this.superpixelColorProbability[index][this.vec2idx([x, y])] *
                                    this.singleProbability / this.colorProbability[index];
                                colorError = util_1.diff(this.palette[index], this.superpixelColor[y][x]).map(function (x) { return Math.abs(x); });
                                matrix[0] += colorSuperpixelProbability * colorError[0] * colorError[0];
                                matrix[1] += colorSuperpixelProbability * colorError[1] * colorError[0];
                                matrix[2] += colorSuperpixelProbability * colorError[2] * colorError[0];
                                matrix[3] += colorSuperpixelProbability * colorError[0] * colorError[1];
                                matrix[4] += colorSuperpixelProbability * colorError[1] * colorError[1];
                                matrix[5] += colorSuperpixelProbability * colorError[2] * colorError[1];
                                matrix[6] += colorSuperpixelProbability * colorError[0] * colorError[2];
                                matrix[7] += colorSuperpixelProbability * colorError[1] * colorError[2];
                                matrix[8] += colorSuperpixelProbability * colorError[2] * colorError[2];
                            }
                            return [4 /*yield*/, this.releaser.release()];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            ++y;
                            return [3 /*break*/, 1];
                        case 4:
                            _a = this.getMaxEigenFunc(matrix), vec = _a.vec, lambda = _a.lambda;
                            len = util_1.normEuclidian(vec);
                            return [2 /*return*/, [vec.map(function (x) { return 0.8 * x / (len || 1); }), 1.1 * Math.sqrt(2 * Math.abs(lambda))]];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.splitColor = function (index) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, index1, index2, nextIndex1, nextIndex2, color1, color2, _b, subColor1, _c, subColor2;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = __read(this.colorPairs[index], 2), index1 = _a[0], index2 = _a[1];
                            nextIndex1 = this.palette.length;
                            nextIndex2 = nextIndex1 + 1;
                            color1 = this.palette[index1];
                            color2 = this.palette[index2];
                            return [4 /*yield*/, this.getMaxEigen(index1)];
                        case 1:
                            _b = __read.apply(void 0, [_d.sent(), 1]), subColor1 = _b[0];
                            return [4 /*yield*/, this.getMaxEigen(index2)];
                        case 2:
                            _c = __read.apply(void 0, [_d.sent(), 1]), subColor2 = _c[0];
                            util_1.add(subColor1, color1);
                            util_1.add(subColor2, color2);
                            this.palette.push(subColor1);
                            this.colorPairs[index][1] = nextIndex1;
                            this.colorProbability[index1] *= 0.5;
                            this.colorProbability.push(this.colorProbability[index1]);
                            this.superpixelColorProbability.push(this.superpixelColorProbability[index1]);
                            this.palette.push(subColor2);
                            this.colorPairs.push([index2, nextIndex2]);
                            this.colorProbability[index2] *= 0.5;
                            this.colorProbability.push(this.colorProbability[index2]);
                            this.superpixelColorProbability.push(this.superpixelColorProbability[index2]);
                            return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.condensePalette = function () {
            this.paletteWasHuge = true;
            var newPalette = [];
            var newColorProbability = [];
            var nPaletteAssign = util_1.array2d(this.outWidth, this.outHeight, function () { return 0; });
            var _loop_10 = function (j) {
                var _a = __read(this_6.colorPairs[j], 2), index1 = _a[0], index2 = _a[1];
                var weight1 = this_6.colorProbability[index1];
                var weight2 = this_6.colorProbability[index2];
                var total_weight = weight1 + weight2;
                weight1 /= total_weight;
                weight2 /= total_weight;
                var color = this_6.palette[index1].map(function (x) { return x * weight1; });
                util_1.add(color, this_6.palette[index2].map(function (x) { return x * weight2; }));
                newPalette.push(color);
                newColorProbability.push(this_6.colorProbability[index1] + this_6.colorProbability[index2]);
                for (var y = 0; y < this_6.outHeight; ++y) {
                    for (var x = 0; x < this_6.outWidth; ++x) {
                        if ([index1, index2].includes(this_6.paletteAt[y][x])) {
                            nPaletteAssign[y][x] = j;
                        }
                    }
                }
            };
            var this_6 = this;
            for (var j = 0; j < this.colorPairs.length; ++j) {
                _loop_10(j);
            }
            this.palette = newPalette;
            this.paletteAt = nPaletteAssign;
            this.colorProbability = newColorProbability;
        };
        GerstnerPixelArt.prototype.expandPalette = function () {
            return __awaiter(this, void 0, void 0, function () {
                var splits, index, _a, index1, index2, color1, color2, error, _b, newColor, i;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (this.paletteWasHuge)
                                return [2 /*return*/];
                            splits = [];
                            index = 0;
                            _c.label = 1;
                        case 1:
                            if (!(index < this.colorPairs.length)) return [3 /*break*/, 5];
                            _a = __read(this.colorPairs[index], 2), index1 = _a[0], index2 = _a[1];
                            color1 = this.palette[index1];
                            color2 = this.palette[index2];
                            error = util_1.dist(color1, color2);
                            if (!(error > 1.6)) return [3 /*break*/, 2];
                            splits.push([error, index]);
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.getMaxEigen(index1)];
                        case 3:
                            _b = __read.apply(void 0, [_c.sent(), 1]), newColor = _b[0];
                            util_1.add(this.palette[index2], newColor);
                            _c.label = 4;
                        case 4:
                            ++index;
                            return [3 /*break*/, 1];
                        case 5:
                            splits.sort(function (a, b) { return b[0] - a[0]; });
                            i = 0;
                            _c.label = 6;
                        case 6:
                            if (!(i < splits.length)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.splitColor(splits[i][1])];
                        case 7:
                            _c.sent();
                            if (this.palette.length >= 2 * this.paletteSize) {
                                this.condensePalette();
                                return [2 /*return*/];
                            }
                            _c.label = 8;
                        case 8:
                            i++;
                            return [3 /*break*/, 6];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.iterate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var paletteError;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.hasConverged)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.updateSuperPixelMapping()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.updateSuperpixelMeans()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.associatePalette()];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.refinePalette()];
                        case 4:
                            paletteError = _a.sent();
                            if (!(paletteError < 1)) return [3 /*break*/, 6];
                            if (this.temperature <= 1)
                                this.hasConverged = true;
                            else
                                this.temperature = Math.max(this.temperature * 0.7, 1);
                            return [4 /*yield*/, this.expandPalette()];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        GerstnerPixelArt.prototype.hasCompleted = function () {
            return this.hasConverged;
        };
        GerstnerPixelArt.prototype.draw = function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                var averagedPalette, _a, pixelSize, superpixelWeight, paletteAt, outHeight, outWidth, palette, mul, y, x, paletteIndex, _b, r, g, b, alpha;
                return __generator(this, function (_c) {
                    averagedPalette = this.getAveragedPalette().map(util_1.lab2rgb);
                    _a = this, pixelSize = _a.pixelSize, superpixelWeight = _a.superpixelWeight, paletteAt = _a.paletteAt, outHeight = _a.outHeight, outWidth = _a.outWidth;
                    palette = averagedPalette.map(function (color) { return ({ color: color, timesUsed: 0 }); });
                    mul = this.totalWeight * 255;
                    for (y = 0; y < outHeight; ++y) {
                        for (x = 0; x < outWidth; ++x) {
                            paletteIndex = paletteAt[y][x];
                            _b = __read(averagedPalette[paletteIndex], 3), r = _b[0], g = _b[1], b = _b[2];
                            alpha = Math.floor(superpixelWeight[y][x] * mul);
                            palette[paletteIndex].timesUsed++;
                            canvas.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize, [r, g, b, alpha]);
                        }
                    }
                    return [2 /*return*/, palette];
                });
            });
        };
        GerstnerPixelArt.prototype.drawRealSized = function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                var averagedPalette, _a, superpixelWeight, paletteAt, outHeight, outWidth, mul, y, x, paletteIndex, _b, r, g, b, alpha;
                return __generator(this, function (_c) {
                    averagedPalette = this.getAveragedPalette().map(util_1.lab2rgb);
                    _a = this, superpixelWeight = _a.superpixelWeight, paletteAt = _a.paletteAt, outHeight = _a.outHeight, outWidth = _a.outWidth;
                    mul = this.totalWeight * 255;
                    for (y = 0; y < outHeight; ++y) {
                        for (x = 0; x < outWidth; ++x) {
                            paletteIndex = paletteAt[y][x];
                            _b = __read(averagedPalette[paletteIndex], 3), r = _b[0], g = _b[1], b = _b[2];
                            alpha = Math.floor(superpixelWeight[y][x] * mul);
                            canvas.setPixel(x, y, [r, g, b, alpha]);
                        }
                    }
                    return [2 /*return*/];
                });
            });
        };
        return GerstnerPixelArt;
    }());
    exports.default = GerstnerPixelArt;
});
define("naive", ["require", "exports", "util"], function (require, exports, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NaivePixelArt = /** @class */ (function () {
        function NaivePixelArt(palette, pixelSize, releaser, pixels, clusterMap) {
            this.lastDistortion = 0;
            this.completed = false;
            this.pixelSize = pixelSize;
            this.releaser = releaser;
            this.palette = palette;
            this.pixels = pixels;
            this.clusterMap = clusterMap;
        }
        NaivePixelArt.fromRandomPalette = function (paletteSize, pixelSize, releaser, pixels) {
            var palette = util_2.array1d(paletteSize, function () { return ({
                timesUsed: 0,
                color: [util_2.randInt(256), util_2.randInt(256), util_2.randInt(256)],
            }); });
            var clusterMap = util_2.array2d(pixels[0].length, pixels.length, function () { return util_2.randInt(paletteSize); });
            return new NaivePixelArt(palette, pixelSize, releaser, pixels, clusterMap);
        };
        NaivePixelArt.prototype.iterate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var distortion, _a, pixels, releaser, palette, clusterMap, centroids, j, row, _loop_11, i, j, row, i, centroid;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            distortion = 0;
                            _a = this, pixels = _a.pixels, releaser = _a.releaser, palette = _a.palette, clusterMap = _a.clusterMap;
                            centroids = palette.map(function (x) { return x.color; });
                            j = 0;
                            _b.label = 1;
                        case 1:
                            if (!(j < pixels.length)) return [3 /*break*/, 4];
                            row = pixels[j];
                            _loop_11 = function (i) {
                                var _a = __read(row[i], 3), r = _a[0], g = _a[1], b = _a[2];
                                var _b = util_2.minWithIndex(centroids.map(function (c) { return util_2.distSquare(c, [r, g, b]); })), index = _b.index, val = _b.val;
                                clusterMap[j][i] = index;
                                distortion += val;
                            };
                            for (i = 0; i < row.length; i++) {
                                _loop_11(i);
                            }
                            return [4 /*yield*/, releaser.release()];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            j++;
                            return [3 /*break*/, 1];
                        case 4:
                            if (distortion === this.lastDistortion) {
                                this.completed = true;
                                return [2 /*return*/];
                            }
                            this.lastDistortion = distortion;
                            this.palette.forEach(function (x) {
                                x.timesUsed = 0;
                                x.color = [0, 0, 0];
                            });
                            j = 0;
                            _b.label = 5;
                        case 5:
                            if (!(j < pixels.length)) return [3 /*break*/, 8];
                            row = pixels[j];
                            for (i = 0; i < row.length; i++) {
                                centroid = this.palette[clusterMap[j][i]];
                                util_2.add(centroid.color, row[i]);
                                centroid.timesUsed++;
                            }
                            return [4 /*yield*/, releaser.release()];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            j++;
                            return [3 /*break*/, 5];
                        case 8:
                            this.palette.forEach(function (x, i) {
                                var _a = __read(x.color, 3), r = _a[0], g = _a[1], b = _a[2], t = x.timesUsed;
                                x.color = t ? util_2.floorColor([r / t, g / t, b / t]) : centroids[i];
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        NaivePixelArt.prototype.hasCompleted = function () {
            return this.completed;
        };
        NaivePixelArt.prototype.draw = function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, palette, pixels, pixelSize, clusterMap, releaser, j, row, i, alpha, _b, r, g, b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this, palette = _a.palette, pixels = _a.pixels, pixelSize = _a.pixelSize, clusterMap = _a.clusterMap, releaser = _a.releaser;
                            j = 0;
                            _c.label = 1;
                        case 1:
                            if (!(j < pixels.length)) return [3 /*break*/, 4];
                            row = pixels[j];
                            for (i = 0; i < row.length; i += pixelSize) {
                                alpha = row[i][3];
                                _b = __read(palette[clusterMap[j][i]].color, 3), r = _b[0], g = _b[1], b = _b[2];
                                canvas.fillRect(i, j, pixelSize, pixelSize, [r, g, b, alpha]);
                            }
                            return [4 /*yield*/, releaser.release()];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            j += pixelSize;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, this.palette];
                    }
                });
            });
        };
        NaivePixelArt.prototype.drawRealSized = function (canvas) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, palette, pixels, pixelSize, clusterMap, releaser, j, y, row, i, x, alpha, _b, r, g, b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this, palette = _a.palette, pixels = _a.pixels, pixelSize = _a.pixelSize, clusterMap = _a.clusterMap, releaser = _a.releaser;
                            j = 0, y = 0;
                            _c.label = 1;
                        case 1:
                            if (!(j < pixels.length)) return [3 /*break*/, 4];
                            row = pixels[j];
                            for (i = 0, x = 0; i < row.length; i += pixelSize, x++) {
                                alpha = row[i][3];
                                _b = __read(palette[clusterMap[j][i]].color, 3), r = _b[0], g = _b[1], b = _b[2];
                                canvas.setPixel(x, y, [r, g, b, alpha]);
                            }
                            return [4 /*yield*/, releaser.release()];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            j += pixelSize, y++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return NaivePixelArt;
    }());
    exports.default = NaivePixelArt;
});
define("releaser", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmptyReleaser = /** @class */ (function () {
        function EmptyReleaser() {
        }
        EmptyReleaser.prototype.release = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        return EmptyReleaser;
    }());
    exports.EmptyReleaser = EmptyReleaser;
    var AnimationFrameReleaser = /** @class */ (function () {
        function AnimationFrameReleaser(thresholdMs, timestampMs) {
            if (thresholdMs === void 0) { thresholdMs = 60; }
            if (timestampMs === void 0) { timestampMs = Date.now(); }
            this.thresholdMs = thresholdMs;
            this.timestampMs = timestampMs;
        }
        AnimationFrameReleaser.prototype.release = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, _a, timestampMs, thresholdMs;
                return __generator(this, function (_b) {
                    now = Date.now();
                    _a = this, timestampMs = _a.timestampMs, thresholdMs = _a.thresholdMs;
                    if (now - timestampMs > thresholdMs) {
                        this.timestampMs = now;
                        return [2 /*return*/, new Promise(function (res) { return requestAnimationFrame(function () { return res(); }); })];
                    }
                    return [2 /*return*/];
                });
            });
        };
        return AnimationFrameReleaser;
    }());
    exports.AnimationFrameReleaser = AnimationFrameReleaser;
});
define("jsfeat", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getMaxEigenWrapper = function (vec9) {
        var lambdas = new jsfeat.matrix_t(3, 1, jsfeat.F32_t | jsfeat.C1_t);
        var vectors = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
        var m = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
        m.data = new Float32Array(vec9);
        jsfeat.linalg.eigenVV(m, vectors, lambdas);
        var _a = __read(vectors.data, 3), x = _a[0], y = _a[1], z = _a[2];
        return { lambda: lambdas.data[0], vec: [x, y, z] };
    };
    exports.default = getMaxEigenWrapper;
});
define("index", ["require", "exports", "dom", "naive", "canvas", "releaser", "gerstner", "jsfeat"], function (require, exports, dom_1, naive_1, canvas_1, releaser_1, gerstner_1, jsfeat_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var releaser = new releaser_1.AnimationFrameReleaser();
    var token = null;
    var setImage = function (url, needRevoke) {
        if (needRevoke === void 0) { needRevoke = false; }
        token = Math.random().toString(16).substr(2);
        var inputs = document.querySelectorAll('#uploads > input');
        for (var i = 0; i < inputs.length; i++)
            inputs.item(i).disabled = true;
        var img = new Image();
        img.onload = function () {
            var canvas = dom_1.dom.canvasOrig;
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0, 0, img.width, img.height);
            ctx.drawImage(img, 0, 0);
            if (needRevoke)
                URL.revokeObjectURL(url);
            for (var i = 0; i < inputs.length; i++)
                inputs.item(i).disabled = false;
            dom_1.dom.nnSubmit.disabled = false;
            dom_1.dom.gerstnerSubmit.disabled = false;
        };
        img.src = url;
    };
    dom_1.dom.uploadInput.onchange = function (e) {
        var url = URL.createObjectURL(e.target.files[0]);
        setImage(url, true);
    };
    dom_1.dom.submitTests.forEach(function (inp, i) { return inp.onclick = setImage.bind(0, [
        'samples/beard.jpg',
        'samples/crash.png',
        'samples/crowd.png',
        'samples/dali.jpg',
        'samples/fireman.jpg',
        'samples/gradient.jpg',
        'samples/gradient2.png',
        'samples/lenna.jpg',
        'samples/lily.jpg',
        'samples/mgs.png',
        'samples/shaving.jpg',
        'samples/vasilii.jpg',
    ][i]); });
    var savePng = function (canvas, pixelArt, pixelSize, token) { return __awaiter(_this, void 0, void 0, function () {
        var c;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    c = document.createElement('canvas');
                    c.width = Math.ceil(canvas.getWidth() / pixelSize);
                    c.height = Math.ceil(canvas.getHeight() / pixelSize);
                    return [4 /*yield*/, pixelArt.drawRealSized(new canvas_1.default(c))];
                case 1:
                    _a.sent();
                    dom_1.saveAs(c.toDataURL('image/png'), token + ".png");
                    return [2 /*return*/];
            }
        });
    }); };
    var createGif = function () { return new GIF({ workerScript: 'lib/gif.worker.js' }); };
    var nnProcess = new dom_1.ButtonProcess(dom_1.dom.nnSubmit);
    dom_1.dom.nnSubmit.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        var token2, canvas, pixels, nn, gif, i, palette, blob;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (nnProcess.isCancelling())
                        return [2 /*return*/];
                    token2 = token;
                    dom_1.dom.gifNn.disabled = true;
                    dom_1.dom.pngNn.disabled = true;
                    dom_1.setProgress(dom_1.dom.progressNn, 0);
                    dom_1.fillPalette(dom_1.dom.paletteNn, []);
                    dom_1.dom.canvasNn.width = dom_1.dom.canvasOrig.width;
                    dom_1.dom.canvasNn.height = dom_1.dom.canvasOrig.height;
                    canvas = new canvas_1.default(dom_1.dom.canvasNn);
                    pixels = (new canvas_1.default(dom_1.dom.canvasOrig)).getPixels();
                    nn = naive_1.default.fromRandomPalette(dom_1.dom.nnColors.valueAsNumber, dom_1.dom.nnFactor.valueAsNumber, releaser, pixels);
                    gif = createGif();
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!!nn.hasCompleted()) return [3 /*break*/, 5];
                    return [4 /*yield*/, nn.iterate()];
                case 2:
                    _a.sent();
                    if (nnProcess.tryFreeButton())
                        return [2 /*return*/];
                    return [4 /*yield*/, nn.draw(canvas)];
                case 3:
                    palette = _a.sent();
                    gif.addFrame(dom_1.dom.canvasNn, { delay: nn.hasCompleted() ? 3000 : 30, copy: true });
                    dom_1.setProgress(dom_1.dom.progressNn, i);
                    dom_1.fillPalette(dom_1.dom.paletteNn, palette);
                    if (nnProcess.tryFreeButton())
                        return [2 /*return*/];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    blob = null;
                    nnProcess.tryFreeButton(true);
                    dom_1.dom.gifNn.disabled = false;
                    dom_1.dom.pngNn.disabled = false;
                    dom_1.dom.pngNn.onclick = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, savePng(canvas, nn, nn.pixelSize, token2)];
                    }); }); };
                    dom_1.dom.gifNn.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!blob) return [3 /*break*/, 2];
                                    gif.render();
                                    return [4 /*yield*/, new Promise(function (res) { return gif.on('finished', res); })];
                                case 1:
                                    blob = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    dom_1.saveAs(URL.createObjectURL(blob), token2 + ".gif");
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/];
            }
        });
    }); };
    var gerstnerProcess = new dom_1.ButtonProcess(dom_1.dom.gerstnerSubmit);
    dom_1.dom.gerstnerSubmit.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        var token2, canvas, pixels, gerstner, gif, i, palette, blob;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (gerstnerProcess.isCancelling())
                        return [2 /*return*/];
                    token2 = token + '_gerstner';
                    dom_1.dom.gifGerstner.disabled = true;
                    dom_1.dom.pngGerstner.disabled = true;
                    dom_1.setProgress(dom_1.dom.progressGerstner, 0);
                    dom_1.fillPalette(dom_1.dom.paletteGerstner, []);
                    dom_1.dom.canvasGerstner.width = dom_1.dom.canvasOrig.width;
                    dom_1.dom.canvasGerstner.height = dom_1.dom.canvasOrig.height;
                    canvas = new canvas_1.default(dom_1.dom.canvasGerstner);
                    pixels = (new canvas_1.default(dom_1.dom.canvasOrig)).getPixels();
                    return [4 /*yield*/, gerstner_1.default.fromImage(pixels, dom_1.dom.gerstnerFactor.valueAsNumber, dom_1.dom.gerstnerColors.valueAsNumber, releaser, jsfeat_1.default)];
                case 1:
                    gerstner = _a.sent();
                    gif = createGif();
                    i = 1;
                    _a.label = 2;
                case 2:
                    if (!!gerstner.hasCompleted()) return [3 /*break*/, 6];
                    return [4 /*yield*/, gerstner.iterate()];
                case 3:
                    _a.sent();
                    if (gerstnerProcess.tryFreeButton())
                        return [2 /*return*/];
                    return [4 /*yield*/, gerstner.draw(canvas)];
                case 4:
                    palette = _a.sent();
                    gif.addFrame(dom_1.dom.canvasGerstner, { delay: gerstner.hasCompleted() ? 3000 : 30, copy: true });
                    dom_1.setProgress(dom_1.dom.progressGerstner, i);
                    dom_1.fillPalette(dom_1.dom.paletteGerstner, palette);
                    if (gerstnerProcess.tryFreeButton())
                        return [2 /*return*/];
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 2];
                case 6:
                    blob = null;
                    gerstnerProcess.tryFreeButton(true);
                    dom_1.dom.gifGerstner.disabled = false;
                    dom_1.dom.pngGerstner.disabled = false;
                    dom_1.dom.pngGerstner.onclick = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, savePng(canvas, gerstner, gerstner.pixelSize, token2)];
                    }); }); };
                    dom_1.dom.gifGerstner.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!blob) return [3 /*break*/, 2];
                                    gif.render();
                                    return [4 /*yield*/, new Promise(function (res) { return gif.on('finished', res); })];
                                case 1:
                                    blob = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    dom_1.saveAs(URL.createObjectURL(blob), token2 + ".gif");
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/];
            }
        });
    }); };
});
define("mapping", ["require", "exports", "util", "releaser"], function (require, exports, util_3, releaser_2) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var releaser = new releaser_2.AnimationFrameReleaser();
    var rx = 0;
    var ry = 0;
    var cubes = Array.from(document.querySelectorAll('.cube'));
    var mouseMove = function (e) {
        rx = rx + e.movementX * 0.8;
        ry = ry + e.movementY * 0.8;
        cubes.forEach(function (x) { return x.setAttribute('style', "transform: rotateX(" + -ry + "deg) rotateY(" + rx + "deg)"); });
    };
    var fillFace = function (canvas, vectorFunc, mapFunc) {
        if (mapFunc === void 0) { mapFunc = util_3.scaledLab2rgb; }
        var ctx = canvas.getContext('2d');
        for (var j = 0; j < 255; j++) {
            for (var i = 0; i < 255; i++) {
                ctx.fillStyle = "rgb(" + mapFunc(vectorFunc(i, j)) + ")";
                ctx.fillRect(i, j, 1, 1);
            }
        }
        return canvas;
    };
    var fillFaces = function (canvases, mapFunc) {
        if (mapFunc === void 0) { mapFunc = util_3.scaledLab2rgb; }
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fillFace(canvases[0], function (x, y) { return [255, 255 - x, y]; }, mapFunc); // front
                        return [4 /*yield*/, releaser.release()];
                    case 1:
                        _a.sent();
                        fillFace(canvases[1], function (x, y) { return [0, x, y]; }, mapFunc); // back
                        return [4 /*yield*/, releaser.release()];
                    case 2:
                        _a.sent();
                        fillFace(canvases[2], function (x, y) { return [255 - y, 255 - x, 0]; }, mapFunc); // top
                        return [4 /*yield*/, releaser.release()];
                    case 3:
                        _a.sent();
                        fillFace(canvases[3], function (x, y) { return [y, 255 - x, 255]; }, mapFunc); // bottom
                        return [4 /*yield*/, releaser.release()];
                    case 4:
                        _a.sent();
                        fillFace(canvases[4], function (x, y) { return [x, 255, y]; }, mapFunc); // left
                        return [4 /*yield*/, releaser.release()];
                    case 5:
                        _a.sent();
                        fillFace(canvases[5], function (x, y) { return [255 - x, 0, y]; }, mapFunc); // right
                        return [2 /*return*/];
                }
            });
        });
    };
    var rgbCanvases = Array.from(document.getElementById('rgb').children);
    var labCanvases = Array.from(document.getElementById('lab').children);
    var tds = Array.from(document.querySelectorAll('td'));
    tds[2].onmousemove = mouseMove;
    tds[3].onmousemove = mouseMove;
    Promise
        .all([fillFaces(rgbCanvases, function (x) { return x; }), fillFaces(labCanvases)])
        .catch(console.error);
});
//# sourceMappingURL=index.js.map