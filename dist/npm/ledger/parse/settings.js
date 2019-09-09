"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var assert = require("assert");
var common_1 = require("../../common");
var AccountFlags = common_1.constants.AccountFlags;
var fields_1 = require("./fields");
function getAccountRootModifiedNode(tx) {
    var modifiedNodes = tx.meta.AffectedNodes.filter(function (node) {
        return node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'AccountRoot';
    });
    assert(modifiedNodes.length === 1);
    return modifiedNodes[0].ModifiedNode;
}
function parseFlags(tx) {
    var settings = {};
    if (tx.TransactionType !== 'AccountSet') {
        return settings;
    }
    var node = getAccountRootModifiedNode(tx);
    var oldFlags = _.get(node.PreviousFields, 'Flags');
    var newFlags = _.get(node.FinalFields, 'Flags');
    if (oldFlags !== undefined && newFlags !== undefined) {
        var changedFlags = oldFlags ^ newFlags;
        var setFlags_1 = newFlags & changedFlags;
        var clearedFlags_1 = oldFlags & changedFlags;
        _.forEach(AccountFlags, function (flagValue, flagName) {
            if (setFlags_1 & flagValue) {
                settings[flagName] = true;
            }
            else if (clearedFlags_1 & flagValue) {
                settings[flagName] = false;
            }
        });
    }
    // enableTransactionIDTracking requires a special case because it
    // does not affect the Flags field; instead it adds/removes a field called
    // "AccountTxnID" to/from the account root.
    var oldField = _.get(node.PreviousFields, 'AccountTxnID');
    var newField = _.get(node.FinalFields, 'AccountTxnID');
    if (newField && !oldField) {
        settings.enableTransactionIDTracking = true;
    }
    else if (oldField && !newField) {
        settings.enableTransactionIDTracking = false;
    }
    return settings;
}
function parseSettings(tx) {
    var txType = tx.TransactionType;
    assert(txType === 'AccountSet' || txType === 'SetRegularKey' ||
        txType === 'SignerListSet');
    return _.assign({}, parseFlags(tx), fields_1.default(tx));
}
exports.default = parseSettings;
//# sourceMappingURL=settings.js.map