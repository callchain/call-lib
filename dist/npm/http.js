"use strict";
/* eslint-disable new-cap */
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var _ = require("lodash");
var jayson = require("jayson");
/* istanbul ignore next */
function createHTTPServer(options, httpPort) {
    var CallAPI = new CallAPI(options);
    var methodNames = _.filter(_.keys(CallAPI.prototype), function (k) {
        return typeof CallAPI.prototype[k] === 'function'
            && k !== 'connect'
            && k !== 'disconnect'
            && k !== 'constructor'
            && k !== 'CallAPI';
    });
    function applyPromiseWithCallback(fnName, callback, args_) {
        try {
            var args = args_;
            if (!_.isArray(args_)) {
                var fnParameters = jayson.Utils.getParameterNames(CallAPI[fnName]);
                args = fnParameters.map(function (name) { return args_[name]; });
                var defaultArgs = _.omit(args_, fnParameters);
                assert(_.size(defaultArgs) <= 1, 'Function must have no more than one default argument');
                if (_.size(defaultArgs) > 0) {
                    args.push(defaultArgs[_.keys(defaultArgs)[0]]);
                }
            }
            Promise.resolve(CallAPI[fnName].apply(CallAPI, args))
                .then(function (res) { return callback(null, res); })
                .catch(function (err) {
                callback({ code: 99, message: err.message, data: { name: err.name } });
            });
        }
        catch (err) {
            callback({ code: 99, message: err.message, data: { name: err.name } });
        }
    }
    var methods = {};
    _.forEach(methodNames, function (fn) {
        methods[fn] = jayson.Method(function (args, cb) {
            applyPromiseWithCallback(fn, cb, args);
        }, { collect: true });
    });
    var server = jayson.server(methods);
    var httpServer = null;
    return {
        server: server,
        start: function () {
            if (httpServer !== null) {
                return Promise.reject('Already started');
            }
            return new Promise(function (resolve) {
                CallAPI.connect().then(function () {
                    httpServer = server.http();
                    httpServer.listen(httpPort, resolve);
                });
            });
        },
        stop: function () {
            if (httpServer === null) {
                return Promise.reject('Not started');
            }
            return new Promise(function (resolve) {
                CallAPI.disconnect();
                httpServer.close(function () {
                    httpServer = null;
                    resolve();
                });
            });
        }
    };
}
exports.createHTTPServer = createHTTPServer;
//# sourceMappingURL=http.js.map