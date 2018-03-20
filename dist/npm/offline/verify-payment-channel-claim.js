"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keypairs = require("call-keypairs");
const binary = require("call-binary-codec");
const common_1 = require("../common");
function verifyPaymentChannelClaim(channel, amount, signature, publicKey) {
    common_1.validate.verifyPaymentChannelClaim({ channel, amount, signature, publicKey });
    const signingData = binary.encodeForSigningClaim({
        channel: channel,
        amount: common_1.callToDrops(amount)
    });
    return keypairs.verify(signingData, signature, publicKey);
}
exports.default = verifyPaymentChannelClaim;
//# sourceMappingURL=verify-payment-channel-claim.js.map