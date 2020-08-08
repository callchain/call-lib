"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAccountInvoices(address) {
    var request = {
        command: 'account_invoices',
        account: address,
    };
    return this.connection.request(request).then(function (response) {
        return response;
    });
}
exports.default = getAccountInvoices;
//# sourceMappingURL=account-invoices.js.map