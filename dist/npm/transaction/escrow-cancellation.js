"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var validate = utils.common.validate;
function createEscrowCancellationTransaction(account, payment) {
    var txJSON = {
        TransactionType: 'EscrowCancel',
        Account: account,
        Owner: payment.owner,
        OfferSequence: payment.escrowSequence
    };
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareEscrowCancellation(address, escrowCancellation, instructions) {
    if (instructions === void 0) { instructions = {}; }
    validate.prepareEscrowCancellation({ address: address, escrowCancellation: escrowCancellation, instructions: instructions });
    var txJSON = createEscrowCancellationTransaction(address, escrowCancellation);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareEscrowCancellation;
//# sourceMappingURL=escrow-cancellation.js.map