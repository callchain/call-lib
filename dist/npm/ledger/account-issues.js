"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var _ = require("lodash");
var account_issue_1 = require("./parse/account-issue");
function formatResponse(options, data) {
    var response = { results: data.lines.map(account_issue_1.default) };
    // if(data.marker){
    //     response.marker = data.marker;
    // }
    // if(data.NickName){
    //     response.nickName = utils.hexToStringWide(data.NickName);
    // }
    // if(data.call_info){
    //     response.call_info = data.call_info;
    // }
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
    // TODO validate
    var _this = this;
    if (options === void 0) { options = {}; }
    return this.getLedgerVersion().then(function (ledgerVersion) {
        var getter = _.partial(getAccountIssuesInternal, _this.connection, address, options.ledgerVersion || ledgerVersion, options);
        return utils.getRecursive(getter, options.limit, options.marker);
    });
}
exports.default = getAccountIssues;
//# sourceMappingURL=account-issues.js.map