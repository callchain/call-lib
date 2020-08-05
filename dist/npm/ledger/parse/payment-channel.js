"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var common_1 = require("../../common");
function parsePaymentChannel(data) {
    return common_1.removeUndefined({
        account: data.Account,
        amount: common_1.dropsToCall(data.Amount),
        balance: common_1.dropsToCall(data.Balance),
        destination: data.Destination,
        publicKey: data.PublicKey,
        settleDelay: data.SettleDelay,
        expiration: utils_1.parseTimestamp(data.Expiration),
        cancelAfter: utils_1.parseTimestamp(data.CancelAfter),
        sourceTag: data.SourceTag,
        destinationTag: data.DestinationTag,
        previousAffectingTransactionID: data.PreviousTxnID,
        previousAffectingTransactionLedgerVersion: data.PreviousTxnLgrSeq
    });
}
exports.default = parsePaymentChannel;
//# sourceMappingURL=payment-channel.js.map