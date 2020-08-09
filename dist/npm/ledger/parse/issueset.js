"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var common_1 = require("../../common");
var flags = common_1.txFlags.IssueSet;
function parseFlag(flagsValue, value) {
    return ((flagsValue & value) !== 0);
}
function parseIssueSet(tx) {
    assert(tx.TransactionType === 'IssueSet');
    return common_1.removeUndefined({
        currency: tx.Total.currency,
        issuer: tx.Total.issuer,
        total: tx.Total.value,
        additional: parseFlag(tx.Flags, flags.Additional),
        invoice: parseFlag(tx.Flags, flags.NonFungible)
    });
}
exports.default = parseIssueSet;
//# sourceMappingURL=issueset.js.map