"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var utils_1 = require("./utils");
var common_1 = require("../../common");
var amount_1 = require("./amount");
function parsePaymentChannelCreate(tx) {
    assert(tx.TransactionType === 'PaymentChannelCreate');
    return common_1.removeUndefined({
        amount: amount_1.default(tx.Amount).value,
        destination: tx.Destination,
        settleDelay: tx.SettleDelay,
        publicKey: tx.PublicKey,
        cancelAfter: tx.CancelAfter && utils_1.parseTimestamp(tx.CancelAfter),
        sourceTag: tx.SourceTag,
        destinationTag: tx.DestinationTag
    });
}
exports.default = parsePaymentChannelCreate;
//# sourceMappingURL=payment-channel-create.js.map