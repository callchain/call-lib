"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function getAccountByName(name, options) {
    if (options === void 0) { options = {}; }
    var request = {
        command: 'nick_search',
        NickName: utils_1.stringToHexWide(name).toUpperCase(),
        ledger_index: options.ledgerVersion || 'validated'
    };
    return this.connection.request(request);
}
exports.default = getAccountByName;
//# sourceMappingURL=nickname.js.map