"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var binary = require("call-binary-codec");
var utils = require("./utils");
var bignumber_js_1 = require("bignumber.js");
var call_address_codec_1 = require("call-address-codec");
var common_1 = require("../common");
var call_hashes_1 = require("call-hashes");
function addressToBigNumber(address) {
    var hex = (new Buffer(call_address_codec_1.decodeAddress(address))).toString('hex');
    return new bignumber_js_1.default(hex, 16);
}
function compareSigners(a, b) {
    return addressToBigNumber(a.Signer.Account)
        .comparedTo(addressToBigNumber(b.Signer.Account));
}
function combine(signedTransactions) {
    common_1.validate.combine({ signedTransactions: signedTransactions });
    // TODO: signedTransactions is an array of strings in the documentation, but
    // tests and this code handle it as an array of objects. Fix!
    var txs = _.map(signedTransactions, binary.decode);
    var tx = _.omit(txs[0], 'Signers');
    if (!_.every(txs, function (_tx) { return _.isEqual(tx, _.omit(_tx, 'Signers')); })) {
        throw new utils.common.errors.ValidationError('txJSON is not the same for all signedTransactions');
    }
    var unsortedSigners = _.reduce(txs, function (accumulator, _tx) {
        return accumulator.concat(_tx.Signers || []);
    }, []);
    var signers = unsortedSigners.sort(compareSigners);
    var signedTx = _.assign({}, tx, { Signers: signers });
    var signedTransaction = binary.encode(signedTx);
    var id = call_hashes_1.computeBinaryTransactionHash(signedTransaction);
    return { signedTransaction: signedTransaction, id: id };
}
exports.default = combine;
//# sourceMappingURL=combine.js.map