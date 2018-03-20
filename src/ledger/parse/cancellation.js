"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
function parseOrderCancellation(tx) {
    assert(tx.TransactionType === 'OfferCancel');
    return {
        orderSequence: tx.OfferSequence
    };
}
exports.default = parseOrderCancellation;
