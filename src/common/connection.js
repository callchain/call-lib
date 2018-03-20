"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var events_1 = require("events");
var url_1 = require("url");
var WebSocket = require("ws");
var rangeset_1 = require("./rangeset");
var errors_1 = require("./errors");
function isStreamMessageType(type) {
    return type === 'ledgerClosed' ||
        type === 'transaction' ||
        type === 'path_find';
}
var Connection = /** @class */ (function (_super) {
    __extends(Connection, _super);
    function Connection(url, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._isReady = false;
        _this._ws = null;
        _this._ledgerVersion = null;
        _this._availableLedgerVersions = new rangeset_1.default();
        _this._nextRequestID = 1;
        _this._retry = 0;
        _this._retryTimer = null;
        _this._onOpenErrorBound = null;
        _this._onUnexpectedCloseBound = null;
        _this._fee_base = null;
        _this._fee_ref = null;
        _this.setMaxListeners(Infinity);
        _this._url = url;
        _this._trace = options.trace || false;
        if (_this._trace) {
            // for easier unit testing
            _this._console = console;
        }
        _this._proxyURL = options.proxy;
        _this._proxyAuthorization = options.proxyAuthorization;
        _this._authorization = options.authorization;
        _this._trustedCertificates = options.trustedCertificates;
        _this._key = options.key;
        _this._passphrase = options.passphrase;
        _this._certificate = options.certificate;
        _this._timeout = options.timeout || (20 * 1000);
        return _this;
    }
    Connection.prototype._updateLedgerVersions = function (data) {
        this._ledgerVersion = Number(data.ledger_index);
        if (data.validated_ledgers) {
            this._availableLedgerVersions.reset();
            this._availableLedgerVersions.parseAndAddRanges(data.validated_ledgers);
        }
        else {
            this._availableLedgerVersions.addValue(this._ledgerVersion);
        }
    };
    Connection.prototype._updateFees = function (data) {
        this._fee_base = Number(data.fee_base);
        this._fee_ref = Number(data.fee_ref);
    };
    // return value is array of arguments to Connection.emit
    Connection.prototype._parseMessage = function (message) {
        var data = JSON.parse(message);
        if (data.type === 'response') {
            if (!(Number.isInteger(data.id) && data.id >= 0)) {
                throw new errors_1.ResponseFormatError('valid id not found in response');
            }
            return [data.id.toString(), data];
        }
        else if (isStreamMessageType(data.type)) {
            if (data.type === 'ledgerClosed') {
                this._updateLedgerVersions(data);
                this._updateFees(data);
            }
            return [data.type, data];
        }
        else if (data.type === undefined && data.error) {
            return ['error', data.error, data.error_message, data]; // e.g. slowDown
        }
        throw new errors_1.ResponseFormatError('unrecognized message type: ' + data.type);
    };
    Connection.prototype._onMessage = function (message) {
        if (this._trace) {
            this._console.log(message);
        }
        var parameters;
        try {
            parameters = this._parseMessage(message);
        }
        catch (error) {
            this.emit('error', 'badMessage', error.message, message);
            return;
        }
        // we don't want this inside the try/catch or exceptions in listener
        // will be caught
        this.emit.apply(this, parameters);
    };
    Object.defineProperty(Connection.prototype, "_state", {
        get: function () {
            return this._ws ? this._ws.readyState : WebSocket.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "_shouldBeConnected", {
        get: function () {
            return this._ws !== null;
        },
        enumerable: true,
        configurable: true
    });
    Connection.prototype.isConnected = function () {
        return this._state === WebSocket.OPEN && this._isReady;
    };
    Connection.prototype._onUnexpectedClose = function (beforeOpen, resolve, reject, code) {
        if (this._onOpenErrorBound) {
            this._ws.removeListener('error', this._onOpenErrorBound);
            this._onOpenErrorBound = null;
        }
        // just in case
        this._ws.removeAllListeners('open');
        this._ws = null;
        this._isReady = false;
        if (beforeOpen) {
            // connection was closed before it was properly opened, so we must return
            // error to connect's caller
            this.connect().then(resolve, reject);
        }
        else {
            // if first parameter ws lib sends close code,
            // but sometimes it forgots about it, so default to 1006 - CLOSE_ABNORMAL
            this.emit('disconnected', code || 1006);
            this._retryConnect();
        }
    };
    Connection.prototype._calculateTimeout = function (retriesCount) {
        return (retriesCount < 40)
            // First, for 2 seconds: 20 times per second
            ? (1000 / 20)
            : (retriesCount < 40 + 60)
                // Then, for 1 minute: once per second
                ? (1000)
                : (retriesCount < 40 + 60 + 60)
                    // Then, for 10 minutes: once every 10 seconds
                    ? (10 * 1000)
                    // Then: once every 30 seconds
                    : (30 * 1000);
    };
    Connection.prototype._retryConnect = function () {
        var _this = this;
        this._retry += 1;
        var retryTimeout = this._calculateTimeout(this._retry);
        this._retryTimer = setTimeout(function () {
            _this.emit('reconnecting', _this._retry);
            _this.connect().catch(_this._retryConnect.bind(_this));
        }, retryTimeout);
    };
    Connection.prototype._clearReconnectTimer = function () {
        if (this._retryTimer !== null) {
            clearTimeout(this._retryTimer);
            this._retryTimer = null;
        }
    };
    Connection.prototype._onOpen = function () {
        var _this = this;
        if (!this._ws) {
            return Promise.reject(new errors_1.DisconnectedError());
        }
        if (this._onOpenErrorBound) {
            this._ws.removeListener('error', this._onOpenErrorBound);
            this._onOpenErrorBound = null;
        }
        var request = {
            command: 'subscribe',
            streams: ['ledger']
        };
        return this.request(request).then(function (data) {
            if (_.isEmpty(data) || !data.ledger_index) {
                return _this._disconnect(false).then(function () {
                    throw new errors_1.CalledNotInitializedError('Called not initialized');
                });
            }
            _this._updateLedgerVersions(data);
            _this._updateFees(data);
            _this._rebindOnUnxpectedClose();
            _this._retry = 0;
            _this._ws.on('error', function (error) {
                // TODO: "type" does not exist on official error type, safe to remove?
                if (process.browser && error && error.type === 'error') {
                    // we are in browser, ignore error - `close` event will be fired
                    // after error
                    return;
                }
                _this.emit('error', 'websocket', error.message, error);
            });
            _this._isReady = true;
            _this.emit('connected');
            return undefined;
        });
    };
    Connection.prototype._rebindOnUnxpectedClose = function () {
        if (this._onUnexpectedCloseBound) {
            this._ws.removeListener('close', this._onUnexpectedCloseBound);
        }
        this._onUnexpectedCloseBound =
            this._onUnexpectedClose.bind(this, false, null, null);
        this._ws.once('close', this._onUnexpectedCloseBound);
    };
    Connection.prototype._unbindOnUnxpectedClose = function () {
        if (this._onUnexpectedCloseBound) {
            this._ws.removeListener('close', this._onUnexpectedCloseBound);
        }
        this._onUnexpectedCloseBound = null;
    };
    Connection.prototype._onOpenError = function (reject, error) {
        this._onOpenErrorBound = null;
        this._unbindOnUnxpectedClose();
        reject(new errors_1.NotConnectedError(error && error.message));
    };
    Connection.prototype._createWebSocket = function () {
        var options = {};
        if (this._proxyURL !== undefined) {
            var parsedURL = url_1.parse(this._url);
            var parsedProxyURL = url_1.parse(this._proxyURL);
            var proxyOverrides = _.omitBy({
                secureEndpoint: (parsedURL.protocol === 'wss:'),
                secureProxy: (parsedProxyURL.protocol === 'https:'),
                auth: this._proxyAuthorization,
                ca: this._trustedCertificates,
                key: this._key,
                passphrase: this._passphrase,
                cert: this._certificate
            }, _.isUndefined);
            var proxyOptions = _.assign({}, parsedProxyURL, proxyOverrides);
            var HttpsProxyAgent = void 0;
            try {
                HttpsProxyAgent = require('https-proxy-agent');
            }
            catch (error) {
                throw new Error('"proxy" option is not supported in the browser');
            }
            options.agent = new HttpsProxyAgent(proxyOptions);
        }
        if (this._authorization !== undefined) {
            var base64 = new Buffer(this._authorization).toString('base64');
            options.headers = { Authorization: "Basic " + base64 };
        }
        var optionsOverrides = _.omitBy({
            ca: this._trustedCertificates,
            key: this._key,
            passphrase: this._passphrase,
            cert: this._certificate
        }, _.isUndefined);
        var websocketOptions = _.assign({}, options, optionsOverrides);
        var websocket = new WebSocket(this._url, null, websocketOptions);
        // we will have a listener for each outstanding request,
        // so we have to raise the limit (the default is 10)
        if (typeof websocket.setMaxListeners === 'function') {
            websocket.setMaxListeners(Infinity);
        }
        return websocket;
    };
    Connection.prototype.connect = function () {
        var _this = this;
        this._clearReconnectTimer();
        return new Promise(function (resolve, reject) {
            if (!_this._url) {
                reject(new errors_1.ConnectionError('Cannot connect because no server was specified'));
            }
            if (_this._state === WebSocket.OPEN) {
                resolve();
            }
            else if (_this._state === WebSocket.CONNECTING) {
                _this._ws.once('open', resolve);
            }
            else {
                _this._ws = _this._createWebSocket();
                // when an error causes the connection to close, the close event
                // should still be emitted; the "ws" documentation says: "The close
                // event is also emitted when then underlying net.Socket closes the
                // connection (end or close)."
                // In case if there is connection error (say, server is not responding)
                // we must return this error to connection's caller. After successful
                // opening, we will forward all errors to main api object.
                _this._onOpenErrorBound = _this._onOpenError.bind(_this, reject);
                _this._ws.once('error', _this._onOpenErrorBound);
                _this._ws.on('message', _this._onMessage.bind(_this));
                // in browser close event can came before open event, so we must
                // resolve connect's promise after reconnect in that case.
                // after open event we will rebound _onUnexpectedCloseBound
                // without resolve and reject functions
                _this._onUnexpectedCloseBound = _this._onUnexpectedClose.bind(_this, true, resolve, reject);
                _this._ws.once('close', _this._onUnexpectedCloseBound);
                _this._ws.once('open', function () { return _this._onOpen().then(resolve, reject); });
            }
        });
    };
    Connection.prototype.disconnect = function () {
        return this._disconnect(true);
    };
    Connection.prototype._disconnect = function (calledByUser) {
        var _this = this;
        if (calledByUser) {
            this._clearReconnectTimer();
            this._retry = 0;
        }
        return new Promise(function (resolve) {
            if (_this._state === WebSocket.CLOSED) {
                resolve();
            }
            else if (_this._state === WebSocket.CLOSING) {
                _this._ws.once('close', resolve);
            }
            else {
                if (_this._onUnexpectedCloseBound) {
                    _this._ws.removeListener('close', _this._onUnexpectedCloseBound);
                    _this._onUnexpectedCloseBound = null;
                }
                _this._ws.once('close', function (code) {
                    _this._ws = null;
                    _this._isReady = false;
                    if (calledByUser) {
                        _this.emit('disconnected', code || 1000); // 1000 - CLOSE_NORMAL
                    }
                    resolve();
                });
                _this._ws.close();
            }
        });
    };
    Connection.prototype.reconnect = function () {
        var _this = this;
        return this.disconnect().then(function () { return _this.connect(); });
    };
    Connection.prototype._whenReady = function (promise) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this._shouldBeConnected) {
                reject(new errors_1.NotConnectedError());
            }
            else if (_this._state === WebSocket.OPEN && _this._isReady) {
                promise.then(resolve, reject);
            }
            else {
                _this.once('connected', function () { return promise.then(resolve, reject); });
            }
        });
    };
    Connection.prototype.getLedgerVersion = function () {
        return this._whenReady(Promise.resolve(this._ledgerVersion));
    };
    Connection.prototype.hasLedgerVersions = function (lowLedgerVersion, highLedgerVersion) {
        return this._whenReady(Promise.resolve(this._availableLedgerVersions.containsRange(lowLedgerVersion, highLedgerVersion || this._ledgerVersion)));
    };
    Connection.prototype.hasLedgerVersion = function (ledgerVersion) {
        return this.hasLedgerVersions(ledgerVersion, ledgerVersion);
    };
    Connection.prototype.getFeeBase = function () {
        return this._whenReady(Promise.resolve(Number(this._fee_base)));
    };
    Connection.prototype.getFeeRef = function () {
        return this._whenReady(Promise.resolve(Number(this._fee_ref)));
    };
    Connection.prototype._send = function (message) {
        var _this = this;
        if (this._trace) {
            this._console.log(message);
        }
        return new Promise(function (resolve, reject) {
            _this._ws.send(message, undefined, function (error) {
                if (error) {
                    reject(new errors_1.DisconnectedError(error.message));
                }
                else {
                    resolve();
                }
            });
        });
    };
    Connection.prototype.request = function (request, timeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this._shouldBeConnected) {
                reject(new errors_1.NotConnectedError());
            }
            var timer = null;
            var self = _this;
            var id = _this._nextRequestID;
            _this._nextRequestID += 1;
            var eventName = id.toString();
            function onDisconnect() {
                clearTimeout(timer);
                self.removeAllListeners(eventName);
                reject(new errors_1.DisconnectedError());
            }
            function cleanup() {
                clearTimeout(timer);
                self.removeAllListeners(eventName);
                if (self._ws !== null) {
                    self._ws.removeListener('close', onDisconnect);
                }
            }
            function _resolve(response) {
                cleanup();
                resolve(response);
            }
            function _reject(error) {
                cleanup();
                reject(error);
            }
            _this.once(eventName, function (response) {
                if (response.status === 'error') {
                    _reject(new errors_1.CalledError(response.error));
                }
                else if (response.status === 'success') {
                    _resolve(response.result);
                }
                else {
                    _reject(new errors_1.ResponseFormatError('unrecognized status: ' + response.status));
                }
            });
            _this._ws.once('close', onDisconnect);
            // JSON.stringify automatically removes keys with value of 'undefined'
            var message = JSON.stringify(Object.assign({}, request, { id: id }));
            _this._whenReady(_this._send(message)).then(function () {
                var delay = timeout || _this._timeout;
                timer = setTimeout(function () { return _reject(new errors_1.TimeoutError()); }, delay);
            }).catch(_reject);
        });
    };
    return Connection;
}(events_1.EventEmitter));
exports.default = Connection;
