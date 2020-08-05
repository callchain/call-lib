"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var utils_1 = require("./utils");
var common_1 = require("../../common");
function parseEscrowCancellation(tx) {
    assert(tx.TransactionType === 'EscrowCancel');
    return common_1.removeUndefined({
        memos: utils_1.parseMemos(tx),
        owner: tx.Owner,
        escrowSequence: tx.OfferSequence
    });
}
exports.default = parseEscrowCancellation;
//# sourceMappingURL=escrow-cancellation.js.map