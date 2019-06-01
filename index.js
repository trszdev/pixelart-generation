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
define("util", ["require", "exports"], function (require, exports) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var lastRelease = Date.now();
    exports.releaseEventLoop = function (thresholdMs) {
        if (thresholdMs === void 0) { thresholdMs = 60; }
        return __awaiter(_this, void 0, void 0, function () {
            var now;
            return __generator(this, function (_a) {
                now = Date.now();
                if (now - lastRelease > thresholdMs) {
                    lastRelease = now;
                    return [2 /*return*/, new Promise(function (res) { return requestAnimationFrame(res); })];
                }
                return [2 /*return*/];
            });
        });
    };
    exports.randInt = function (max, min) {
        if (min === void 0) { min = 0; }
        return Math.floor((max - min) * Math.random()) + min;
    };
    exports.wait = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (res) { return setTimeout(res, ms); })];
    }); }); };
    exports.clamp = function (val, min, max) { return Math.max(Math.min(max, val), min); };
    exports.floorColor = function (c) { return c.map(function (x) { return exports.clamp(Math.round(x), 0, 255); }); };
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
    exports.fillPalette = function (domPalette, colors, paletteUsage) {
        exports.clearChildren(domPalette);
        var allUsage = paletteUsage.reduce(function (acc, x) { return acc + x; });
        var colorsWithUsage = colors.map(function (c, i) { return c.concat(paletteUsage[i]); }).sort(function (a, b) { return b[3] - a[3]; });
        colorsWithUsage.forEach(function (_a) {
            var _b = __read(_a, 4), r = _b[0], g = _b[1], b = _b[2], u = _b[3];
            var node = document.createElement('div');
            node.title = u ? "Usage " + Math.floor(u / allUsage * 10000) / 100 + "%" : "This color wasn't used";
            node.className = u ? 'color' : 'unused color';
            node.style.background = "rgb(" + [r, g, b] + ")";
            domPalette.appendChild(node);
        });
    };
});
define("naive", ["require", "exports", "util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.maxColorDist = 256 * 256 * 3;
    var NaiveSolution = /** @class */ (function () {
        function NaiveSolution(k, factor, canvas, imageData, kCycles, events, shouldRedrawOnCycle) {
            if (kCycles === void 0) { kCycles = 10000; }
            if (events === void 0) { events = new EventTarget(); }
            if (shouldRedrawOnCycle === void 0) { shouldRedrawOnCycle = true; }
            this.k = k;
            this.kCycles = kCycles;
            this.factor = factor;
            this.canvas = canvas;
            this.imageData = imageData;
            this.events = events;
            this.shouldRedrawOnCycle = shouldRedrawOnCycle;
        }
        NaiveSolution.prototype.emitProgress = function (iteration) {
            this.events.dispatchEvent(new CustomEvent('progress', { detail: iteration }));
        };
        NaiveSolution.prototype.emitPalette = function (palette, paletteUsage) {
            this.events.dispatchEvent(new CustomEvent('palette', { detail: { palette: palette, paletteUsage: paletteUsage } }));
        };
        NaiveSolution.prototype.kMeans = function () {
            return __awaiter(this, void 0, void 0, function () {
                var centroids, means, _a, width, height, data, clusterMap, lastDistortion, _loop_1, this_1, kc, state_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            centroids = __spread(Array(this.k).keys()).map(function () { return [util_1.randInt(256), util_1.randInt(256), util_1.randInt(256)]; });
                            means = centroids.map(function (_) { return [0, 0, 0, 0]; });
                            _a = this.imageData, width = _a.width, height = _a.height, data = _a.data;
                            clusterMap = Array(height);
                            this.emitProgress(0);
                            this.emitPalette(centroids, centroids.map(function (_) { return 0; }));
                            return [4 /*yield*/, util_1.releaseEventLoop()];
                        case 1:
                            _b.sent();
                            lastDistortion = 0;
                            _loop_1 = function (kc) {
                                var counter, distortion, nextRgb, j, _loop_2, i, j, i, _a, r, g, b, centroid, palette, paletteUsage;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            counter = 0;
                                            distortion = 0;
                                            nextRgb = function () {
                                                var r = data[counter++];
                                                var g = data[counter++];
                                                var b = data[counter++];
                                                counter++;
                                                return [r, g, b];
                                            };
                                            j = 0;
                                            _b.label = 1;
                                        case 1:
                                            if (!(j < height)) return [3 /*break*/, 4];
                                            _loop_2 = function (i) {
                                                var _a = __read(nextRgb(), 3), r = _a[0], g = _a[1], b = _a[2];
                                                if (!clusterMap[j])
                                                    clusterMap[j] = Array(width);
                                                var _b = __read(centroids.reduce(function (_a, _b, i) {
                                                    var _c = __read(_a, 2), mi = _c[0], minDist = _c[1];
                                                    var _d = __read(_b, 3), pr = _d[0], pg = _d[1], pb = _d[2];
                                                    var dr = pr - r;
                                                    var dg = pg - g;
                                                    var db = pb - b;
                                                    var dist = dr * dr + dg * dg + db * db;
                                                    return minDist < dist ? [mi, minDist] : [i, dist];
                                                }, [0, exports.maxColorDist]), 2), index = _b[0], val = _b[1];
                                                clusterMap[j][i] = index;
                                                distortion += val;
                                            };
                                            for (i = 0; i < width; i++) {
                                                _loop_2(i);
                                            }
                                            return [4 /*yield*/, util_1.releaseEventLoop()];
                                        case 2:
                                            _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            j++;
                                            return [3 /*break*/, 1];
                                        case 4:
                                            counter = 0;
                                            means = centroids.map(function (_) { return [0, 0, 0, 0]; });
                                            j = 0;
                                            _b.label = 5;
                                        case 5:
                                            if (!(j < height)) return [3 /*break*/, 8];
                                            for (i = 0; i < width; i++) {
                                                _a = __read(nextRgb(), 3), r = _a[0], g = _a[1], b = _a[2];
                                                centroid = means[clusterMap[j][i]];
                                                centroid[0] += r;
                                                centroid[1] += g;
                                                centroid[2] += b;
                                                centroid[3]++;
                                            }
                                            return [4 /*yield*/, util_1.releaseEventLoop()];
                                        case 6:
                                            _b.sent();
                                            _b.label = 7;
                                        case 7:
                                            j++;
                                            return [3 /*break*/, 5];
                                        case 8:
                                            means.forEach(function (_a, i) {
                                                var _b = __read(_a, 4), mr = _b[0], mg = _b[1], mb = _b[2], t = _b[3];
                                                if (t)
                                                    centroids[i] = [mr / t, mg / t, mb / t];
                                            });
                                            palette = centroids.map(util_1.floorColor);
                                            paletteUsage = means.map(function (x) { return x[3]; });
                                            this_1.emitProgress(kc);
                                            this_1.emitPalette(palette, paletteUsage);
                                            return [4 /*yield*/, util_1.releaseEventLoop()];
                                        case 9:
                                            _b.sent();
                                            if (!(this_1.shouldRedrawOnCycle || kc === this_1.kCycles || lastDistortion === distortion)) return [3 /*break*/, 11];
                                            return [4 /*yield*/, this_1.draw(palette, clusterMap)];
                                        case 10:
                                            _b.sent();
                                            _b.label = 11;
                                        case 11:
                                            if (lastDistortion === distortion) {
                                                return [2 /*return*/, { value: void 0 }];
                                            }
                                            lastDistortion = distortion;
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            kc = 1;
                            _b.label = 2;
                        case 2:
                            if (!(kc <= this.kCycles)) return [3 /*break*/, 5];
                            return [5 /*yield**/, _loop_1(kc)];
                        case 3:
                            state_1 = _b.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            _b.label = 4;
                        case 4:
                            kc++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        NaiveSolution.prototype.draw = function (palette, clusterMap) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, factor, _b, data, width, height, ctx, j, i, current, alpha, pix;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this, factor = _a.factor, _b = _a.imageData, data = _b.data, width = _b.width, height = _b.height;
                            ctx = this.canvas.getContext('2d');
                            j = 0;
                            _c.label = 1;
                        case 1:
                            if (!(j < height)) return [3 /*break*/, 4];
                            for (i = 0; i < width; i += factor) {
                                current = j * width + i;
                                alpha = data[current * 4 + 3] / 255;
                                pix = palette[clusterMap[j][i]];
                                ctx.clearRect(i, j, factor, factor);
                                ctx.fillStyle = "rgba(" + pix.concat(alpha) + ")";
                                ctx.fillRect(i, j, factor, factor);
                            }
                            return [4 /*yield*/, util_1.releaseEventLoop()];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            j += factor;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return NaiveSolution;
    }());
    exports.NaiveSolution = NaiveSolution;
});
define("index", ["require", "exports", "dom", "naive"], function (require, exports, dom_1, naive_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
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
    dom_1.dom.nnSubmit.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, width, height, imageData, ns, onProgress, onPalette;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dom_1.dom.nnSubmit.disabled = true;
                    _a = dom_1.dom.canvasOrig, width = _a.width, height = _a.height;
                    dom_1.dom.canvasNn.width = width;
                    dom_1.dom.canvasNn.height = height;
                    dom_1.dom.canvasNn.getContext('2d').clearRect(0, 0, width, height);
                    imageData = dom_1.dom.canvasOrig.getContext('2d').getImageData(0, 0, width, height);
                    ns = new naive_1.NaiveSolution(dom_1.dom.nnColors.valueAsNumber, dom_1.dom.nnFactor.valueAsNumber, dom_1.dom.canvasNn, imageData);
                    onProgress = function (e) { return dom_1.setProgress(dom_1.dom.progressNn, e.detail); };
                    onPalette = function (_a) {
                        var _b = _a.detail, palette = _b.palette, paletteUsage = _b.paletteUsage;
                        return dom_1.fillPalette(dom_1.dom.paletteNn, palette, paletteUsage);
                    };
                    ns.events.addEventListener('progress', onProgress);
                    ns.events.addEventListener('palette', onPalette);
                    return [4 /*yield*/, ns.kMeans()];
                case 1:
                    _b.sent();
                    ns.events.removeEventListener('progress', onProgress);
                    ns.events.removeEventListener('palette', onPalette);
                    dom_1.dom.nnSubmit.disabled = false;
                    return [2 /*return*/];
            }
        });
    }); };
    dom_1.dom.gerstnerSubmit.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dom_1.dom.gerstnerSubmit.disabled = true;
            dom_1.dom.gerstnerSubmit.disabled = false;
            return [2 /*return*/];
        });
    }); };
});
define("mapping", ["require", "exports", "util"], function (require, exports, util_2) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
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
                        return [4 /*yield*/, util_2.releaseEventLoop()];
                    case 1:
                        _a.sent();
                        fillFace(canvases[1], function (x, y) { return [0, x, y]; }, mapFunc); // back
                        return [4 /*yield*/, util_2.releaseEventLoop()];
                    case 2:
                        _a.sent();
                        fillFace(canvases[2], function (x, y) { return [255 - y, 255 - x, 0]; }, mapFunc); // top
                        return [4 /*yield*/, util_2.releaseEventLoop()];
                    case 3:
                        _a.sent();
                        fillFace(canvases[3], function (x, y) { return [y, 255 - x, 255]; }, mapFunc); // bottom
                        return [4 /*yield*/, util_2.releaseEventLoop()];
                    case 4:
                        _a.sent();
                        fillFace(canvases[4], function (x, y) { return [x, 255, y]; }, mapFunc); // left
                        return [4 /*yield*/, util_2.releaseEventLoop()];
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