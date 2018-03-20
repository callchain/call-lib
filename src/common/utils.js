"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var bignumber_js_1 = require("bignumber.js");
var deriveKeypair = require('../../dist/keypairs/distrib/npm/index.js').deriveKeypair;
function isValidSecret(secret) {
    try {
        deriveKeypair(secret);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isValidSecret = isValidSecret;
function dropsToXrp(drops) {
    return (new bignumber_js_1.default(drops)).dividedBy(1000000.0).toString();
}
exports.dropsToXrp = dropsToXrp;
function xrpToDrops(xrp) {
    return (new bignumber_js_1.default(xrp)).times(1000000.0).floor().toString();
}
exports.xrpToDrops = xrpToDrops;
function toCalledAmount(amount) {
    if (amount.currency === 'XRP') {
        return xrpToDrops(amount.value);
    }
    return {
        currency: amount.currency,
        issuer: amount.counterparty ? amount.counterparty :
            (amount.issuer ? amount.issuer : undefined),
        value: amount.value
    };
}
exports.toCalledAmount = toCalledAmount;
function convertKeysFromSnakeCaseToCamelCase(obj) {
    if (typeof obj === 'object') {
        var newKey_1;
        return _.reduce(obj, function (result, value, key) {
            newKey_1 = key;
            // taking this out of function leads to error in PhantomJS
            var FINDSNAKE = /([a-zA-Z]_[a-zA-Z])/g;
            if (FINDSNAKE.test(key)) {
                newKey_1 = key.replace(FINDSNAKE, function (r) { return r[0] + r[2].toUpperCase(); });
            }
            result[newKey_1] = convertKeysFromSnakeCaseToCamelCase(value);
            return result;
        }, {});
    }
    return obj;
}
exports.convertKeysFromSnakeCaseToCamelCase = convertKeysFromSnakeCaseToCamelCase;
function removeUndefined(obj) {
    return _.omitBy(obj, _.isUndefined);
}
exports.removeUndefined = removeUndefined;
/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 *
 */
function callToUnixTimestamp(rpepoch) {
    return (rpepoch + 0x386D4380) * 1000;
}
function unixToCallTimestamp(timestamp) {
    return Math.round(timestamp / 1000) - 0x386D4380;
}
function callTimeToISO8601(callTime) {
    return new Date(callToUnixTimestamp(callTime)).toISOString();
}
exports.callTimeToISO8601 = callTimeToISO8601;
function iso8601ToCallTime(iso8601) {
    return unixToCallTimestamp(Date.parse(iso8601));
}
exports.iso8601ToCallTime = iso8601ToCallTime;
