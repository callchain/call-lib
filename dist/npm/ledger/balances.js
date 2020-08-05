"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var common_1 = require("../common");
function getTrustlineBalanceAmount(trustline) {
    return {
        currency: trustline.specification.currency,
        counterparty: trustline.specification.counterparty,
        value: trustline.state.balance
    };
}
function formatBalances(options, balances) {
    var result = balances.trustlines.results.map(getTrustlineBalanceAmount);
    if (!(options.counterparty ||
        (options.currency && options.currency !== 'CALL'))) {
        var callBalance = {
            currency: 'CALL',
            value: balances.call
        };
        result.unshift(callBalance);
    }
    if (options.limit && result.length > options.limit) {
        var toRemove = result.length - options.limit;
        result.splice(-toRemove, toRemove);
    }
    return result;
}
function getLedgerVersionHelper(connection, optionValue) {
    if (optionValue !== undefined && optionValue !== null) {
        return Promise.resolve(optionValue);
    }
    return connection.getLedgerVersion();
}
function getBalances(address, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    common_1.validate.getTrustlines({ address: address, options: options });
    return Promise.all([
        getLedgerVersionHelper(this.connection, options.ledgerVersion).then(function (ledgerVersion) {
            return utils.getCALLBalance(_this.connection, address, ledgerVersion);
        }),
        this.getTrustlines(address, options)
    ]).then(function (results) {
        return formatBalances(options, { call: results[0], trustlines: results[1] });
    });
}
exports.default = getBalances;
//# sourceMappingURL=balances.js.map