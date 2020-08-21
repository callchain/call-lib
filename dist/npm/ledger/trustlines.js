"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var common_1 = require("../common");
var account_trustline_1 = require("./parse/account-trustline");
// interface GetAccountLinesResponse {
//   marker?: any,
//   results: Trustline[]
// }
function currencyFilter(currency, trustline) {
    return currency === null || trustline.specification.currency === currency;
}
function formatResponse(options, data) {
    return {
        marker: data.marker,
        results: data.lines.map(account_trustline_1.default)
            .filter(_.partial(currencyFilter, options.currency || null))
    };
}
function getAccountLines(connection, address, ledgerVersion, options, marker, limit) {
    var request = {
        command: 'account_lines',
        account: address,
        ledger_index: ledgerVersion,
        marker: marker,
        limit: utils.clamp(limit, 10, 400),
        peer: options.counterparty
    };
    return connection.request(request).then(_.partial(formatResponse, options));
}
function getTrustlines(address, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    common_1.validate.getTrustlines({ address: address, options: options });
    return this.getLedgerVersion().then(function (ledgerVersion) {
        var getter = _.partial(getAccountLines, _this.connection, address, options.ledgerVersion || ledgerVersion, options);
        return utils.getRecursive(getter, options.limit);
    });
}
exports.default = getTrustlines;
//# sourceMappingURL=trustlines.js.map