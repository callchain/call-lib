"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var common_1 = require("../../common");
var amount_1 = require("./amount");
var claimFlags = common_1.txFlags.PaymentChannelClaim;
function parsePaymentChannelClaim(tx) {
    assert(tx.TransactionType === 'PaymentChannelClaim');
    return common_1.removeUndefined({
        channel: tx.Channel,
        balance: tx.Balance && amount_1.default(tx.Balance).value,
        amount: tx.Amount && amount_1.default(tx.Amount).value,
        signature: tx.Signature,
        publicKey: tx.PublicKey,
        renew: Boolean(tx.Flags & claimFlags.Renew) || undefined,
        close: Boolean(tx.Flags & claimFlags.Close) || undefined
    });
}
exports.default = parsePaymentChannelClaim;
//# sourceMappingURL=payment-channel-claim.js.map