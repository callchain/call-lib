"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var bignumber_js_1 = require("bignumber.js");
var utils = require("./utils");
var validate = utils.common.validate;
var issuesetFlags = utils.common.txFlags.IssueSet;
var ValidationError = utils.common.errors.ValidationError;
var AccountFlagIndices = utils.common.constants.AccountFlagIndices;
var AccountFields = utils.common.constants.AccountFields;
// Emptry string passed to setting will clear it
var CLEAR_SETTING = null;
function setTransactionFlags(txJSON, values) {
    var keys = Object.keys(values);
    //assert(keys.length === 1, 'ERROR: can only set one setting per transaction')
    var flagName = keys[0];
    var value = values[flagName];
    var index = AccountFlagIndices[flagName];
    if (index !== undefined) {
        if (value) {
            txJSON.SetFlag = index;
        }
        else {
            txJSON.ClearFlag = index;
        }
    }
}
function setTransactionFields(txJSON, input) {
    var fieldSchema = AccountFields;
    for (var fieldName in fieldSchema) {
        var field = fieldSchema[fieldName];
        var value = input[field.name];
        if (value === undefined) {
            continue;
        }
        // The value required to clear an account root field varies
        if (value === CLEAR_SETTING && field.hasOwnProperty('defaults')) {
            value = field.defaults;
        }
        if (field.encoding === 'hex' && !field.length) {
            // This is currently only used for Domain field
            value = new Buffer(value, 'ascii').toString('hex').toUpperCase();
        }
        txJSON[fieldName] = value;
    }
}
/**
 *  Note: A fee of 1% requires 101% of the destination to be sent for the
 *        destination to receive 100%.
 *  The transfer rate is specified as the input amount as fraction of 1.
 *  To specify the default rate of 0%, a 100% input amount, specify 1.
 *  To specify a rate of 1%, a 101% input amount, specify 1.01
 *
 *  @param {Number|String} transferRate
 *
 *  @returns {Number|String} numbers will be converted while strings
 *                           are returned
 */
function convertTransferRate(transferRate) {
    return (new bignumber_js_1.default(transferRate)).shift(9).toNumber();
}
function createIssueSetTransactionWithoutMemos(account, issueset) {
    if (issueset.total == undefined) {
        throw new ValidationError('total amount should be present');
    }
    if (issueset.total.issuer !== account) {
        throw new ValidationError('only allow to issue asset for self');
    }
    var txJSON = {
        TransactionType: 'IssueSet',
        Account: account,
        Total: issueset.total,
        Flags: 0
    };
    setTransactionFlags(txJSON, _.omit(issueset, 'memos'));
    setTransactionFields(txJSON, issueset);
    if (txJSON.TransferRate && issueset.nonFungible) {
        throw new ValidationError('Non fungible asset not allow to set transfer rate');
    }
    if (txJSON.TransferRate !== undefined) {
        txJSON.TransferRate = convertTransferRate(txJSON.TransferRate);
    }
    if (issueset.additional) {
        txJSON.Flags |= issuesetFlags.Additional;
    }
    if (issueset.nonFungible) {
        txJSON.Flags |= issuesetFlags.NonFungible;
    }
    return txJSON;
}
function createIssueSetTransaction(account, issueset) {
    var txJSON = createIssueSetTransactionWithoutMemos(account, issueset);
    if (issueset.memos !== undefined) {
        txJSON.Memos = _.map(issueset.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareIssueSet(address, issueset, instructions) {
    if (instructions === void 0) { instructions = {}; }
    //validate.prepareSettings({address, issueset, instructions})
    validate.prepareIssueSet({ address: address, issueset: issueset, instructions: instructions });
    var txJSON = createIssueSetTransaction(address, issueset);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareIssueSet;
//# sourceMappingURL=issue-set.js.map