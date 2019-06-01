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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
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
        nnFactor: document.getElementById('nn-factor'),
        nnColors: document.getElementById('nn-colors'),
        nnSubmit: document.getElementById('nn-submit'),
        gerstnerFactor: document.getElementById('gerstner-factor'),
        gerstnerColors: document.getElementById('gerstner-colors'),
        gerstnerSubmit: document.getElementById('gerstner-submit'),
        uploadInput: document.getElementById('upload'),
        submitTests: [1, 2, 3, 4, 5, 6].map(function (i) { return document.getElementById("submit-test" + i); }),
    };
    exports.setProgress = function (node, val) {
        exports.clearChildren(node);
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
        paletteCopy.sort(function (a, b) { return b.timesUsed - a.timesUsed; });
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
    exports.normSquare = function (v) { return v.reduce(function (acc, x) { return acc + x * x; }, 0); };
    exports.normEuclidian = function (v) { return Math.sqrt(exports.normSquare(v)); };
    exports.distSquare = function (from, to) { return exports.normSquare(exports.diff(from, to)); };
    exports.minWithIndex = function (v) {
        var _a = __read(v.reduce(function (_a, x, i) {
            var _b = __read(_a, 2), mi = _b[0], mx = _b[1];
            return mx > x ? [i, x] : [mi, mx];
        }, [-1, Number.MAX_VALUE]), 2), index = _a[0], val = _a[1];
        return { index: index, val: val };
    };
    /*
    color conversions are from https://github.com/antimatter15/rgb-lab/blob/master/color.js
    slightly modified to map lab components in range of [0, 255]
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
define("naive", ["require", "exports", "util"], function (require, exports, util_1) {
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
            var palette = __spread(Array(paletteSize).keys()).map(function () { return ({
                timesUsed: 0,
                color: [util_1.randInt(256), util_1.randInt(256), util_1.randInt(256)],
            }); });
            var clusterMap = Array(pixels.length);
            for (var i = 0; i < pixels.length; i++)
                clusterMap[i] = Array(pixels[0].length).fill(util_1.randInt(paletteSize));
            return new NaivePixelArt(palette, pixelSize, releaser, pixels, clusterMap);
        };
        NaivePixelArt.prototype.iterate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var distortion, _a, pixels, releaser, palette, clusterMap, centroids, j, row, _loop_1, i, j, row, i, _b, r, g, b, centroid;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            distortion = 0;
                            _a = this, pixels = _a.pixels, releaser = _a.releaser, palette = _a.palette, clusterMap = _a.clusterMap;
                            centroids = palette.map(function (x) { return x.color; });
                            j = 0;
                            _c.label = 1;
                        case 1:
                            if (!(j < pixels.length)) return [3 /*break*/, 4];
                            row = pixels[j];
                            _loop_1 = function (i) {
                                var _a = __read(row[i], 3), r = _a[0], g = _a[1], b = _a[2];
                                var _b = util_1.minWithIndex(centroids.map(function (c) { return util_1.distSquare(c, [r, g, b]); })), index = _b.index, val = _b.val;
                                clusterMap[j][i] = index;
                                distortion += val;
                            };
                            for (i = 0; i < row.length; i++) {
                                _loop_1(i);
                            }
                            return [4 /*yield*/, releaser.release()];
                        case 2:
                            _c.sent();
                            _c.label = 3;
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
                            _c.label = 5;
                        case 5:
                            if (!(j < pixels.length)) return [3 /*break*/, 8];
                            row = pixels[j];
                            for (i = 0; i < row.length; i++) {
                                _b = __read(row[i], 3), r = _b[0], g = _b[1], b = _b[2];
                                centroid = this.palette[clusterMap[j][i]];
                                centroid.color[0] += r;
                                centroid.color[1] += g;
                                centroid.color[2] += b;
                                centroid.timesUsed++;
                            }
                            return [4 /*yield*/, releaser.release()];
                        case 6:
                            _c.sent();
                            _c.label = 7;
                        case 7:
                            j++;
                            return [3 /*break*/, 5];
                        case 8:
                            this.palette.forEach(function (x) {
                                var _a = __read(x.color, 3), r = _a[0], g = _a[1], b = _a[2], t = x.timesUsed;
                                if (t)
                                    x.color = util_1.floorColor([r / t, g / t, b / t]);
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
        return NaivePixelArt;
    }());
    exports.NaivePixelArt = NaivePixelArt;
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
define("index", ["require", "exports", "dom", "naive", "canvas", "releaser"], function (require, exports, dom_1, naive_1, canvas_1, releaser_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var releaser = new releaser_1.AnimationFrameReleaser();
    var setImage = function (url, needRevoke) {
        if (needRevoke === void 0) { needRevoke = false; }
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
        'samples/vasilii.jpg',
        'samples/sonic.png',
        'samples/lenna.jpg',
        'samples/teapot.png',
        'samples/gradient.jpg',
        'samples/lily.jpg'
    ][i]); });
    var nnProcess = new dom_1.ButtonProcess(dom_1.dom.nnSubmit);
    dom_1.dom.nnSubmit.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        var canvas, pixels, ns, i, palette;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (nnProcess.isCancelling())
                        return [2 /*return*/];
                    dom_1.dom.canvasNn.width = dom_1.dom.canvasOrig.width;
                    dom_1.dom.canvasNn.height = dom_1.dom.canvasOrig.height;
                    canvas = new canvas_1.default(dom_1.dom.canvasNn);
                    pixels = (new canvas_1.default(dom_1.dom.canvasOrig)).getPixels();
                    ns = naive_1.NaivePixelArt.fromRandomPalette(dom_1.dom.nnColors.valueAsNumber, dom_1.dom.nnFactor.valueAsNumber, releaser, pixels);
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!!ns.hasCompleted()) return [3 /*break*/, 5];
                    return [4 /*yield*/, ns.iterate()];
                case 2:
                    _a.sent();
                    if (nnProcess.tryFreeButton())
                        return [2 /*return*/];
                    return [4 /*yield*/, ns.draw(canvas)];
                case 3:
                    palette = _a.sent();
                    dom_1.setProgress(dom_1.dom.progressNn, i);
                    dom_1.fillPalette(dom_1.dom.paletteNn, palette);
                    if (nnProcess.tryFreeButton())
                        return [2 /*return*/];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    nnProcess.tryFreeButton(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var gerstnerProcess = new dom_1.ButtonProcess(dom_1.dom.gerstnerSubmit);
    dom_1.dom.gerstnerSubmit.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        var canvas, pixels, ns, i, palette;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (gerstnerProcess.isCancelling())
                        return [2 /*return*/];
                    dom_1.dom.canvasGerstner.width = dom_1.dom.canvasOrig.width;
                    dom_1.dom.canvasGerstner.height = dom_1.dom.canvasOrig.height;
                    canvas = new canvas_1.default(dom_1.dom.canvasGerstner);
                    pixels = (new canvas_1.default(dom_1.dom.canvasOrig)).getPixels();
                    ns = naive_1.NaivePixelArt.fromRandomPalette(dom_1.dom.gerstnerColors.valueAsNumber, dom_1.dom.gerstnerFactor.valueAsNumber, releaser, pixels);
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!!ns.hasCompleted()) return [3 /*break*/, 5];
                    return [4 /*yield*/, ns.iterate()];
                case 2:
                    _a.sent();
                    if (gerstnerProcess.tryFreeButton())
                        return [2 /*return*/];
                    return [4 /*yield*/, ns.draw(canvas)];
                case 3:
                    palette = _a.sent();
                    dom_1.setProgress(dom_1.dom.progressGerstner, i);
                    dom_1.fillPalette(dom_1.dom.paletteGerstner, palette);
                    if (gerstnerProcess.tryFreeButton())
                        return [2 /*return*/];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    gerstnerProcess.tryFreeButton(true);
                    return [2 /*return*/];
            }
        });
    }); };
});
define("mapping", ["require", "exports", "util", "releaser"], function (require, exports, util_2, releaser_2) {
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
        if (mapFunc === void 0) { mapFunc = util_2.scaledLab2rgb; }
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
        if (mapFunc === void 0) { mapFunc = util_2.scaledLab2rgb; }
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