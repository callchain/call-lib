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
var events_1 = require("events");
/**
 * Provides `EventEmitter` interface for native browser `WebSocket`,
 * same, as `ws` package provides.
 */
var WSWrapper = /** @class */ (function (_super) {
    __extends(WSWrapper, _super);
    function WSWrapper(url, _protocols, _websocketOptions) {
        var _this = _super.call(this) || this;
        _this.setMaxListeners(Infinity);
        _this._ws = new WebSocket(url);
        _this._ws.onclose = function () {
            _this.emit('close');
        };
        _this._ws.onopen = function () {
            _this.emit('open');
        };
        _this._ws.onerror = function (error) {
            _this.emit('error', error);
        };
        _this._ws.onmessage = function (message) {
            _this.emit('message', message.data);
        };
        return _this;
    }
    WSWrapper.prototype.close = function () {
        if (this.readyState === 1) {
            this._ws.close();
        }
    };
    WSWrapper.prototype.send = function (message) {
        this._ws.send(message);
    };
    Object.defineProperty(WSWrapper.prototype, "readyState", {
        get: function () {
            return this._ws.readyState;
        },
        enumerable: true,
        configurable: true
    });
    WSWrapper.CONNECTING = 0;
    WSWrapper.OPEN = 1;
    WSWrapper.CLOSING = 2;
    WSWrapper.CLOSED = 3;
    return WSWrapper;
}(events_1.EventEmitter));
module.exports = WSWrapper;
//# sourceMappingURL=wswrapper.js.map