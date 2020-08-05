"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var utils_1 = require("./utils");
var common_1 = require("../../common");
var flags = common_1.txFlags.TrustSet;
function parseFlag(flagsValue, trueValue, falseValue) {
    if (flagsValue & trueValue) {
        return true;
    }
    if (flagsValue & falseValue) {
        return false;
    }
    return undefined;
}
function parseTrustline(tx) {
    assert(tx.TransactionType === 'TrustSet');
    return common_1.removeUndefined({
        limit: tx.LimitAmount.value,
        currency: tx.LimitAmount.currency,
        counterparty: tx.LimitAmount.issuer,
        qualityIn: utils_1.parseQuality(tx.QualityIn),
        qualityOut: utils_1.parseQuality(tx.QualityOut),
        callingDisabled: parseFlag(tx.Flags, flags.SetNoCall, flags.ClearNoCall),
        frozen: parseFlag(tx.Flags, flags.SetFreeze, flags.ClearFreeze),
        authorized: parseFlag(tx.Flags, flags.SetAuth, 0)
    });
}
exports.default = parseTrustline;
//# sourceMappingURL=trustline.js.map