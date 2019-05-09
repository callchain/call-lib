"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var utils_1 = require("./utils");
var common_1 = require("../../common");
var amount_1 = require("./amount");
function parsePaymentChannelFund(tx) {
    assert(tx.TransactionType === 'PaymentChannelFund');
    return common_1.removeUndefined({
        channel: tx.Channel,
        amount: amount_1.default(tx.Amount).value,
        expiration: tx.Expiration && utils_1.parseTimestamp(tx.Expiration)
    });
}
exports.default = parsePaymentChannelFund;
//# sourceMappingURL=payment-channel-fund.js.map