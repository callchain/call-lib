"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("../common");
const keypairs = require("call-keypairs");
const binary = require("call-binary-codec");
const { validate, callToDrops } = common;
function signPaymentChannelClaim(channel, amount, privateKey) {
    validate.signPaymentChannelClaim({ channel, amount, privateKey });
    const signingData = binary.encodeForSigningClaim({
        channel: channel,
        amount: callToDrops(amount)
    });
    return keypairs.sign(signingData, privateKey);
}
exports.default = signPaymentChannelClaim;
//# sourceMappingURL=sign-payment-channel-claim.js.map