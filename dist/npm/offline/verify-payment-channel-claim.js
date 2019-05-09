"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var keypairs = require("call-keypairs");
var binary = require("call-binary-codec");
var common_1 = require("../common");
function verifyPaymentChannelClaim(channel, amount, signature, publicKey) {
    common_1.validate.verifyPaymentChannelClaim({ channel: channel, amount: amount, signature: signature, publicKey: publicKey });
    var signingData = binary.encodeForSigningClaim({
        channel: channel,
        amount: common_1.callToDrops(amount)
    });
    return keypairs.verify(signingData, signature, publicKey);
}
exports.default = verifyPaymentChannelClaim;
//# sourceMappingURL=verify-payment-channel-claim.js.map