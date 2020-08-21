"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var _ = require("lodash");
var common_1 = require("../common");
var account_issue_1 = require("./parse/account-issue");
// interface GetAccountIssuesResponse {
//   marker?: any,
//   results: IssueItem[]
// }
function currencyFilter(invoice, issue) {
    return invoice === null || issue.specification.invoice === invoice;
}
function formatResponse(options, data) {
    var response = { results: data.lines.map(account_issue_1.default)
            .filter(_.partial(currencyFilter, options.invoice || null)) };
    if (data.marker) {
        response['marker'] = data.marker;
    }
    return response;
}
function getAccountIssuesInternal(connection, address, ledgerVersion, options, marker, limit) {
    var request = {
        command: 'account_issues',
        account: address,
        ledger_index: ledgerVersion,
        marker: marker,
        limit: utils.clamp(limit, 10, 400),
    };
    return connection.request(request).then(_.partial(formatResponse, options));
}
function getAccountIssues(address, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    common_1.validate.getIssues({ address: address, options: options });
    return this.getLedgerVersion().then(function (ledgerVersion) {
        var getter = _.partial(getAccountIssuesInternal, _this.connection, address, options.ledgerVersion || ledgerVersion, options);
        return utils.getRecursive(getter, options.limit);
    });
}
exports.default = getAccountIssues;
//# sourceMappingURL=issues.js.map