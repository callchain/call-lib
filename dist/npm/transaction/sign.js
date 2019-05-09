"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var keypairs = require("call-keypairs");
var binary = require("call-binary-codec");
var call_hashes_1 = require("call-hashes");
var validate = utils.common.validate;
function computeSignature(tx, privateKey, signAs) {
    var signingData = signAs ?
        binary.encodeForMultisigning(tx, signAs) : binary.encodeForSigning(tx);
    return keypairs.sign(signingData, privateKey);
}
function sign(txJSON, secret, options) {
    if (options === void 0) { options = {}; }
    validate.sign({ txJSON: txJSON, secret: secret });
    // we can't validate that the secret matches the account because
    // the secret could correspond to the regular key
    var tx = JSON.parse(txJSON);
    if (tx.TxnSignature || tx.Signers) {
        throw new utils.common.errors.ValidationError('txJSON must not contain "TxnSignature" or "Signers" properties');
    }
    var keypair = keypairs.deriveKeypair(secret);
    tx.SigningPubKey = options.signAs ? '' : keypair.publicKey;
    if (options.signAs) {
        var signer = {
            Account: options.signAs,
            SigningPubKey: keypair.publicKey,
            TxnSignature: computeSignature(tx, keypair.privateKey, options.signAs)
        };
        tx.Signers = [{ Signer: signer }];
    }
    else {
        tx.TxnSignature = computeSignature(tx, keypair.privateKey);
    }
    var serialized = binary.encode(tx);
    return {
        signedTransaction: serialized,
        id: call_hashes_1.computeBinaryTransactionHash(serialized)
    };
}
exports.default = sign;
//# sourceMappingURL=sign.js.map