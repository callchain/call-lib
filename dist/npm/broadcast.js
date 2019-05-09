"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var api_1 = require("./api");
var CallAPIBroadcast = /** @class */ (function (_super) {
    __extends(CallAPIBroadcast, _super);
    function CallAPIBroadcast(servers, options) {
        var _this = _super.call(this, options) || this;
        _this.ledgerVersion = undefined;
        var apis = servers.map(function (server) { return new api_1.CallAPI(_.assign({}, options, { server: server })); });
        // exposed for testing
        _this._apis = apis;
        _this.getMethodNames().forEach(function (name) {
            _this[name] = function () {
                return Promise.race(apis.map(function (api) { return api[name].apply(api, arguments); }));
            };
        });
        // connection methods must be overridden to apply to all api instances
        _this.connect = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(apis.map(function (api) { return api.connect(); }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        _this.disconnect = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(apis.map(function (api) { return api.disconnect(); }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        _this.isConnected = function () {
            return apis.map(function (api) { return api.isConnected(); }).every(Boolean);
        };
        // synchronous methods are all passed directly to the first api instance
        var defaultAPI = apis[0];
        var syncMethods = ['sign', 'generateAddress', 'computeLedgerHash'];
        syncMethods.forEach(function (name) {
            _this[name] = defaultAPI[name].bind(defaultAPI);
        });
        apis.forEach(function (api) {
            api.on('ledger', _this.onLedgerEvent.bind(_this));
            api.on('error', function (errorCode, errorMessage, data) {
                return _this.emit('error', errorCode, errorMessage, data);
            });
        });
        return _this;
    }
    CallAPIBroadcast.prototype.onLedgerEvent = function (ledger) {
        if (ledger.ledgerVersion > this.ledgerVersion ||
            this.ledgerVersion === undefined) {
            this.ledgerVersion = ledger.ledgerVersion;
            this.emit('ledger', ledger);
        }
    };
    CallAPIBroadcast.prototype.getMethodNames = function () {
        var methodNames = [];
        var CallAPI = this._apis[0];
        for (var _i = 0, _a = Object.getOwnPropertyNames(CallAPI); _i < _a.length; _i++) {
            var name = _a[_i];
            if (typeof CallAPI[name] === 'function') {
                methodNames.push(name);
            }
        }
        return methodNames;
    };
    return CallAPIBroadcast;
}(api_1.CallAPI));
exports.CallAPIBroadcast = CallAPIBroadcast;
//# sourceMappingURL=broadcast.js.map