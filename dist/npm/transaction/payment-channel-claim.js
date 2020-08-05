"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var ValidationError = utils.common.errors.ValidationError;
var claimFlags = utils.common.txFlags.PaymentChannelClaim;
var common_1 = require("../common");
function createPaymentChannelClaimTransaction(account, claim) {
    var txJSON = {
        Account: account,
        TransactionType: 'PaymentChannelClaim',
        Channel: claim.channel,
        Flags: 0
    };
    if (claim.balance !== undefined) {
        txJSON.Balance = common_1.callToDrops(claim.balance);
    }
    if (claim.amount !== undefined) {
        txJSON.Amount = common_1.callToDrops(claim.amount);
    }
    if (Boolean(claim.signature) !== Boolean(claim.publicKey)) {
        throw new ValidationError('"signature" and "publicKey" fields on'
            + ' PaymentChannelClaim must only be specified together.');
    }
    if (claim.signature !== undefined) {
        txJSON.Signature = claim.signature;
    }
    if (claim.publicKey !== undefined) {
        txJSON.PublicKey = claim.publicKey;
    }
    if (claim.renew === true && claim.close === true) {
        throw new ValidationError('"renew" and "close" flags on PaymentChannelClaim'
            + ' are mutually exclusive');
    }
    if (claim.renew === true) {
        txJSON.Flags |= claimFlags.Renew;
    }
    if (claim.close === true) {
        txJSON.Flags |= claimFlags.Close;
    }
    return txJSON;
}
function preparePaymentChannelClaim(address, paymentChannelClaim, instructions) {
    if (instructions === void 0) { instructions = {}; }
    common_1.validate.preparePaymentChannelClaim({ address: address, paymentChannelClaim: paymentChannelClaim, instructions: instructions });
    var txJSON = createPaymentChannelClaimTransaction(address, paymentChannelClaim);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = preparePaymentChannelClaim;
//# sourceMappingURL=payment-channel-claim.js.map