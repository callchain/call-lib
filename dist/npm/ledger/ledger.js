"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var ledger_1 = require("./parse/ledger");
function getLedger(options) {
    if (options === void 0) { options = {}; }
    common_1.validate.getLedger({ options: options });
    var request = {
        command: 'ledger',
        ledger_index: options.ledgerVersion || 'validated',
        ledger_hash: options.ledgerHash,
        expand: options.includeAllData,
        transactions: options.includeTransactions,
        accounts: options.includeState
    };
    return this.connection.request(request).then(function (response) {
        return ledger_1.default(response.ledger);
    });
}
exports.default = getLedger;
//# sourceMappingURL=ledger.js.map