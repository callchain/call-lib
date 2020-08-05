"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var common_1 = require("../common");
function formatBalanceSheet(balanceSheet) {
    var result = {};
    if (!_.isUndefined(balanceSheet.balances)) {
        result.balances = [];
        _.forEach(balanceSheet.balances, function (balances, counterparty) {
            _.forEach(balances, function (balance) {
                result.balances.push(Object.assign({ counterparty: counterparty }, balance));
            });
        });
    }
    if (!_.isUndefined(balanceSheet.assets)) {
        result.assets = [];
        _.forEach(balanceSheet.assets, function (assets, counterparty) {
            _.forEach(assets, function (balance) {
                result.assets.push(Object.assign({ counterparty: counterparty }, balance));
            });
        });
    }
    if (!_.isUndefined(balanceSheet.obligations)) {
        result.obligations = _.map(balanceSheet.obligations, function (value, currency) { return ({ currency: currency, value: value }); });
    }
    return result;
}
function getBalanceSheet(address, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    common_1.validate.getBalanceSheet({ address: address, options: options });
    return utils.ensureLedgerVersion.call(this, options).then(function (_options) {
        var request = {
            command: 'gateway_balances',
            account: address,
            strict: true,
            hotwallet: _options.excludeAddresses,
            ledger_index: _options.ledgerVersion
        };
        return _this.connection.request(request).then(formatBalanceSheet);
    });
}
exports.default = getBalanceSheet;
//# sourceMappingURL=balance-sheet.js.map