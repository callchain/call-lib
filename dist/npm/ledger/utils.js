"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var assert = require("assert");
var common = require("../common");
exports.common = common;
function clamp(value, min, max) {
    assert(min <= max, 'Illegal clamp bounds');
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
function getCALLBalance(connection, address, ledgerVersion) {
    var request = {
        command: 'account_info',
        account: address,
        ledger_index: ledgerVersion
    };
    return connection.request(request).then(function (data) {
        return common.dropsToCall(data.account_data.Balance);
    });
}
exports.getCALLBalance = getCALLBalance;
// If the marker is omitted from a response, you have reached the end
function getRecursiveRecur(getter, marker, limit) {
    return getter(marker, limit).then(function (data) {
        var remaining = limit - data.results.length;
        if (remaining > 0 && data.marker !== undefined) {
            return getRecursiveRecur(getter, data.marker, remaining).then(function (results) {
                return data.results.concat(results);
            });
        }
        return data.results.slice(0, limit);
    });
}
/**
 * In user terminal, user DO NOT need to care marker,
 * user user page offset and limit model
 * @param getter
 * @param limit
 */
function getRecursive(getter, limit) {
    return getRecursiveRecur(getter, undefined, limit || Infinity);
}
exports.getRecursive = getRecursive;
function renameCounterpartyToIssuer(obj) {
    var issuer = (obj.counterparty !== undefined) ?
        obj.counterparty :
        ((obj.issuer !== undefined) ? obj.issuer : undefined);
    var withIssuer = Object.assign({}, obj, { issuer: issuer });
    delete withIssuer.counterparty;
    return withIssuer;
}
exports.renameCounterpartyToIssuer = renameCounterpartyToIssuer;
function renameCounterpartyToIssuerInOrder(order) {
    var taker_gets = renameCounterpartyToIssuer(order.taker_gets);
    var taker_pays = renameCounterpartyToIssuer(order.taker_pays);
    var changes = { taker_gets: taker_gets, taker_pays: taker_pays };
    return _.assign({}, order, _.omitBy(changes, _.isUndefined));
}
exports.renameCounterpartyToIssuerInOrder = renameCounterpartyToIssuerInOrder;
function signum(num) {
    return (num === 0) ? 0 : (num > 0 ? 1 : -1);
}
function compareTransactions(first, second) {
    if (!first.outcome || !second.outcome) {
        return 0;
    }
    if (first.outcome.ledgerVersion === second.outcome.ledgerVersion) {
        return signum(first.outcome.indexInLedger - second.outcome.indexInLedger);
    }
    return first.outcome.ledgerVersion < second.outcome.ledgerVersion ? -1 : 1;
}
exports.compareTransactions = compareTransactions;
function hasCompleteLedgerRange(connection, minLedgerVersion, maxLedgerVersion) {
    var firstLedgerVersion = 32570; // earlier versions have been lost
    return connection.hasLedgerVersions(minLedgerVersion || firstLedgerVersion, maxLedgerVersion);
}
exports.hasCompleteLedgerRange = hasCompleteLedgerRange;
function isPendingLedgerVersion(connection, maxLedgerVersion) {
    return connection.getLedgerVersion().then(function (ledgerVersion) {
        return ledgerVersion < (maxLedgerVersion || 0);
    });
}
exports.isPendingLedgerVersion = isPendingLedgerVersion;
function ensureLedgerVersion(options) {
    if (Boolean(options) && options.ledgerVersion !== undefined &&
        options.ledgerVersion !== null) {
        return Promise.resolve(options);
    }
    return this.getLedgerVersion().then(function (ledgerVersion) {
        return _.assign({}, options, { ledgerVersion: ledgerVersion });
    });
}
exports.ensureLedgerVersion = ensureLedgerVersion;
function hexToStringWide(h) {
    var a = [];
    var i = 0;
    if (h.length % 4) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 4), 16)));
        i = 4;
    }
    for (; i < h.length; i += 4) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i + 4), 16)));
    }
    return a.join('');
}
exports.hexToStringWide = hexToStringWide;
//# sourceMappingURL=utils.js.map