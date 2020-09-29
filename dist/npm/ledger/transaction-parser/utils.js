"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var bignumber_js_1 = require("bignumber.js");
function dropsToCALL(drops) {
    return drops.dividedBy(1000000);
}
exports.dropsToCALL = dropsToCALL;
function normalizeNode(affectedNode) {
    var diffType = Object.keys(affectedNode)[0];
    var node = affectedNode[diffType];
    return {
        diffType: diffType,
        entryType: node.LedgerEntryType,
        ledgerIndex: node.LedgerIndex,
        newFields: node.NewFields || {},
        finalFields: node.FinalFields || {},
        previousFields: node.PreviousFields || {}
    };
}
function normalizeNodes(metadata) {
    if (!metadata.AffectedNodes) {
        return [];
    }
    return metadata.AffectedNodes.map(normalizeNode);
}
exports.normalizeNodes = normalizeNodes;
function parseCurrencyAmount(currencyAmount) {
    if (currencyAmount === undefined) {
        return undefined;
    }
    if (typeof currencyAmount === 'string') {
        return {
            currency: 'CALL',
            value: dropsToCALL(new bignumber_js_1.default(currencyAmount)).toString()
        };
    }
    return {
        currency: currencyAmount.currency,
        counterparty: currencyAmount.issuer,
        value: currencyAmount.value
    };
}
exports.parseCurrencyAmount = parseCurrencyAmount;
function isAccountField(fieldName) {
    var fieldNames = ['Account', 'Owner', 'Destination', 'Issuer', 'Target'];
    return _.includes(fieldNames, fieldName);
}
function isAmountFieldAffectingIssuer(fieldName) {
    var fieldNames = ['LowLimit', 'HighLimit', 'TakerPays', 'TakerGets'];
    return _.includes(fieldNames, fieldName);
}
function getAffectedAccounts(metadata) {
    var accounts = [];
    _.forEach(normalizeNodes(metadata), function (node) {
        var fields = node.diffType === 'CreatedNode' ?
            node.newFields : node.finalFields;
        _.forEach(fields, function (fieldValue, fieldName) {
            if (isAccountField(fieldName)) {
                accounts.push(fieldValue);
            }
            else if (isAmountFieldAffectingIssuer(fieldName) && fieldValue.issuer) {
                accounts.push(fieldValue.issuer);
            }
        });
    });
    return _.uniq(accounts);
}
exports.getAffectedAccounts = getAffectedAccounts;
//# sourceMappingURL=utils.js.map