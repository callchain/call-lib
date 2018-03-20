"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keypairs = require("call-keypairs");
function fromSecret(secret) {
    try {
        const keypair = keypairs.deriveKeypair(secret);
        const address = keypairs.deriveAddress(keypair.publicKey);
        return { secret: secret, address: address };
    }
    catch (error) {
        return null;
    }
}
exports.fromSecret = fromSecret;
;
//# sourceMappingURL=address-fromSecret.js.map