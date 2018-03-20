"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const common_1 = require("../../common");
const flags = common_1.txFlags.TrustSet;
function parseFlag(flagsValue, trueValue, falseValue) {
    if (flagsValue & trueValue) {
        return true;
    }
    if (flagsValue & falseValue) {
        return false;
    }
    return undefined;
}
function parseIssueSet(tx) {
    assert(tx.TransactionType === 'IssueSet');
    return tx;
}
exports.default = parseIssueSet;
//# sourceMappingURL=issue-set.js.map