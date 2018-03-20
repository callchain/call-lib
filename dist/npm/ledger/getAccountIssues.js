"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAccountIssues(address) {
    const request = {
        command: 'account_issues',
        account: address,
    };
    return this.connection.request(request);
}
exports.default = getAccountIssues;
//# sourceMappingURL=getAccountIssues.js.map