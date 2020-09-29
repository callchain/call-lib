"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var bignumber_js_1 = require("bignumber.js");
var utils_1 = require("./utils");
var utils_2 = require("./utils");
function groupByAddress(balanceChanges) {
    var grouped = _.groupBy(balanceChanges, function (node) {
        return node.address;
    });
    return _.mapValues(grouped, function (group) {
        return _.map(group, function (node) {
            return node.balance;
        });
    });
}
function parseValue(value) {
    return new bignumber_js_1.default(value.value || value);
}
function computeBalanceChange(node) {
    var value = null;
    if (node.newFields.Balance) {
        value = parseValue(node.newFields.Balance);
    }
    else if (node.previousFields.Balance && node.finalFields.Balance) {
        value = parseValue(node.finalFields.Balance).minus(parseValue(node.previousFields.Balance));
    }
    return value === null ? null : value.isZero() ? null : value;
}
function parseFinalBalance(node) {
    if (node.newFields.Balance) {
        return parseValue(node.newFields.Balance);
    }
    else if (node.finalFields.Balance) {
        return parseValue(node.finalFields.Balance);
    }
    return null;
}
function parseCALLQuantity(node, valueParser) {
    var value = valueParser(node);
    if (value === null) {
        return null;
    }
    return {
        address: node.finalFields.Account || node.newFields.Account,
        balance: {
            counterparty: '',
            currency: 'CALL',
            value: utils_2.dropsToCALL(value).toString()
        }
    };
}
function flipTrustlinePerspective(quantity) {
    var negatedBalance = (new bignumber_js_1.default(quantity.balance.value)).negated();
    return {
        address: quantity.balance.counterparty,
        balance: {
            counterparty: quantity.address,
            currency: quantity.balance.currency,
            value: negatedBalance.toString()
        }
    };
}
function parseTrustlineQuantity(node, valueParser) {
    var value = valueParser(node);
    if (value === null) {
        return null;
    }
    /*
     * A trustline can be created with a non-zero starting balance
     * If an offer is placed to acquire an asset with no existing trustline,
     * the trustline can be created when the ofer is taken.
     */
    var fields = _.isEmpty(node.newFields) ? node.finalFields : node.newFields;
    // the balance is always from low node's perspective
    var result = {
        address: fields.LowLimit.issuer,
        balance: {
            counterparty: fields.HighLimit.issuer,
            currency: fields.Balance.currency,
            value: value.toString()
        }
    };
    return [result, flipTrustlinePerspective(result)];
}
function parseQuantities(metadata, valueParser) {
    var values = utils_1.normalizeNodes(metadata).map(function (node) {
        if (node.entryType === 'AccountRoot') {
            return [parseCALLQuantity(node, valueParser)];
        }
        else if (node.entryType === 'CallState') {
            return parseTrustlineQuantity(node, valueParser);
        }
        return [];
    });
    return groupByAddress(_.compact(_.flatten(values)));
}
/**
 *  Computes the complete list of every balance that changed in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metada
 *  @returns {Object} parsed balance changes
 */
function parseBalanceChanges(metadata) {
    return parseQuantities(metadata, computeBalanceChange);
}
exports.parseBalanceChanges = parseBalanceChanges;
/**
 *  Computes the complete list of every final balance in the ledger
 *  as a result of the given transaction.
 *
 *  @param {Object} metadata Transaction metada
 *  @returns {Object} parsed balances
 */
function parseFinalBalances(metadata) {
    return parseQuantities(metadata, parseFinalBalance);
}
exports.parseFinalBalances = parseFinalBalances;
//# sourceMappingURL=balancechanges.js.map