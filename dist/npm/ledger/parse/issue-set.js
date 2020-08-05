"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
//import {parseQuality} from './utils'
//import {txFlags, removeUndefined} from '../../common'
//const flags = txFlags.TrustSet
// function parseFlag(flagsValue, trueValue, falseValue) {
//   if (flagsValue & trueValue) {
//     return true
//   }
//   if (flagsValue & falseValue) {
//     return false
//   }
//   return undefined
// }
function parseIssueSet(tx) {
    assert(tx.TransactionType === 'IssueSet');
    return tx;
}
exports.default = parseIssueSet;
//# sourceMappingURL=issue-set.js.map