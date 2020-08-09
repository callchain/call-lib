"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../../common");
var flags = common_1.txFlags.IssueSet;
function parseFlag(flagsValue, value) {
    return ((flagsValue & value) !== 0);
}
function parseAccountIssue(issue) {
    var specification = common_1.removeUndefined({
        currency: issue.Total.currency,
        issuer: issue.Total.issuer,
        value: issue.Total.value,
        additional: parseFlag(issue.Flags, flags.Additional),
        invoice: parseFlag(issue.Flags, flags.NonFungible),
        transferRate: issue.TransferRate
    });
    var state = {
        fans: issue.Fans,
        issued: issue.Issued.value,
        freeze: issue.Freeze.value
    };
    var result = { specification: specification, state: state };
    return result;
}
exports.default = parseAccountIssue;
//# sourceMappingURL=account-issue.js.map