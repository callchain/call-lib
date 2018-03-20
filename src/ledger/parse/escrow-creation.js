"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var amount_1 = require("./amount");
var utils_1 = require("./utils");
var common_1 = require("../../common");
function parseEscrowCreation(tx) {
    assert(tx.TransactionType === 'EscrowCreate');
    return common_1.removeUndefined({
        amount: amount_1.default(tx.Amount).value,
        destination: tx.Destination,
        memos: utils_1.parseMemos(tx),
        condition: tx.Condition,
        allowCancelAfter: utils_1.parseTimestamp(tx.CancelAfter),
        allowExecuteAfter: utils_1.parseTimestamp(tx.FinishAfter),
        sourceTag: tx.SourceTag,
        destinationTag: tx.DestinationTag
    });
}
exports.default = parseEscrowCreation;
