"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var bignumber_js_1 = require("bignumber.js");
var utils = require("./utils");
var validate = utils.common.validate;
var trustlineFlags = utils.common.txFlags.TrustSet;
function convertQuality(quality) {
    return (new bignumber_js_1.default(quality)).shift(9).truncated().toNumber();
}
function createTrustlineTransaction(account, trustline) {
    var limit = {
        currency: trustline.currency,
        issuer: trustline.counterparty,
        value: trustline.limit
    };
    var txJSON = {
        TransactionType: 'TrustSet',
        Account: account,
        LimitAmount: limit,
        Flags: 0
    };
    if (trustline.qualityIn !== undefined) {
        txJSON.QualityIn = convertQuality(trustline.qualityIn);
    }
    if (trustline.qualityOut !== undefined) {
        txJSON.QualityOut = convertQuality(trustline.qualityOut);
    }
    if (trustline.authorized === true) {
        txJSON.Flags |= trustlineFlags.SetAuth;
    }
    if (trustline.callingDisabled !== undefined) {
        txJSON.Flags |= trustline.callingDisabled ?
            trustlineFlags.NoCall : trustlineFlags.ClearNoCall;
    }
    if (trustline.frozen !== undefined) {
        txJSON.Flags |= trustline.frozen ?
            trustlineFlags.SetFreeze : trustlineFlags.ClearFreeze;
    }
    if (trustline.memos !== undefined) {
        txJSON.Memos = _.map(trustline.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareTrustline(address, trustline, instructions) {
    if (instructions === void 0) { instructions = {}; }
    validate.prepareTrustline({ address: address, trustline: trustline, instructions: instructions });
    var txJSON = createTrustlineTransaction(address, trustline);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareTrustline;
//# sourceMappingURL=trustline.js.map