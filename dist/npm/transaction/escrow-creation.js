"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var common_1 = require("../common");
var ValidationError = utils.common.errors.ValidationError;
function createEscrowCreationTransaction(account, payment) {
    var txJSON = {
        TransactionType: 'EscrowCreate',
        Account: account,
        Destination: payment.destination,
        Amount: common_1.callToDrops(payment.amount)
    };
    if (payment.condition !== undefined) {
        txJSON.Condition = payment.condition;
    }
    if (payment.allowCancelAfter !== undefined) {
        txJSON.CancelAfter = common_1.iso8601ToCallTime(payment.allowCancelAfter);
    }
    if (payment.allowExecuteAfter !== undefined) {
        txJSON.FinishAfter = common_1.iso8601ToCallTime(payment.allowExecuteAfter);
    }
    if (payment.sourceTag !== undefined) {
        txJSON.SourceTag = payment.sourceTag;
    }
    if (payment.destinationTag !== undefined) {
        txJSON.DestinationTag = payment.destinationTag;
    }
    if (payment.memos !== undefined) {
        txJSON.Memos = _.map(payment.memos, utils.convertMemo);
    }
    if (Boolean(payment.allowCancelAfter) && Boolean(payment.allowExecuteAfter) &&
        txJSON.CancelAfter <= txJSON.FinishAfter) {
        throw new ValidationError('"CancelAfter" must be after "FinishAfter" for'
            + ' EscrowCreate');
    }
    return txJSON;
}
function prepareEscrowCreation(address, escrowCreation, instructions) {
    if (instructions === void 0) { instructions = {}; }
    common_1.validate.prepareEscrowCreation({ address: address, escrowCreation: escrowCreation, instructions: instructions });
    var txJSON = createEscrowCreationTransaction(address, escrowCreation);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareEscrowCreation;
//# sourceMappingURL=escrow-creation.js.map