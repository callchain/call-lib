"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var keypairs = require("call-keypairs");
function fromSecret(secret) {
    try {
        var keypair = keypairs.deriveKeypair(secret);
        var address = keypairs.deriveAddress(keypair.publicKey);
        return { secret: secret, address: address };
    }
    catch (error) {
        return null;
    }
}
exports.fromSecret = fromSecret;
;
//# sourceMappingURL=address-fromSecret.js.map