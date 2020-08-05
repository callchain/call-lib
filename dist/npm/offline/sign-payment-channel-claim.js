"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common = require("../common");
var keypairs = require("call-keypairs");
var binary = require("call-binary-codec");
var validate = common.validate, callToDrops = common.callToDrops;
function signPaymentChannelClaim(channel, amount, privateKey) {
    validate.signPaymentChannelClaim({ channel: channel, amount: amount, privateKey: privateKey });
    var signingData = binary.encodeForSigningClaim({
        channel: channel,
        amount: callToDrops(amount)
    });
    return keypairs.sign(signingData, privateKey);
}
exports.default = signPaymentChannelClaim;
//# sourceMappingURL=sign-payment-channel-claim.js.map