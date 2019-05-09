"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var validate = utils.common.validate;
var ValidationError = utils.common.errors.ValidationError;
function createEscrowExecutionTransaction(account, payment) {
    var txJSON = {
        TransactionType: 'EscrowFinish',
        Account: account,
        Owner: payment.owner,
        OfferSequence: payment.escrowSequence
    };
    if (Boolean(payment.condition) !== Boolean(payment.fulfillment)) {
        throw new ValidationError('"condition" and "fulfillment" fields on'
            + ' EscrowFinish must only be specified together.');
    }
    if (payment.condition !== undefined) {
        txJSON.Condition = payment.condition;
    }
    if (payment.fulfillment !== undefined) {
        txJSON.Fulfillment = payment.fulfillment;
    }
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareEscrowExecution(address, escrowExecution, instructions) {
    if (instructions === void 0) { instructions = {}; }
    validate.prepareEscrowExecution({ address: address, escrowExecution: escrowExecution, instructions: instructions });
    var txJSON = createEscrowExecutionTransaction(address, escrowExecution);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareEscrowExecution;
//# sourceMappingURL=escrow-execution.js.map