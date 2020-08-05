"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var fields_1 = require("./parse/fields");
var common_1 = require("../common");
var AccountFlags = common_1.constants.AccountFlags;
function parseFlags(value) {
    var settings = {};
    for (var flagName in AccountFlags) {
        if (value & AccountFlags[flagName]) {
            settings[flagName] = true;
        }
    }
    return settings;
}
function formatSettings(response) {
    var data = response.account_data;
    var parsedFlags = parseFlags(data.Flags);
    var parsedFields = fields_1.default(data);
    return _.assign({}, parsedFlags, parsedFields);
}
function getSettings(address, options) {
    if (options === void 0) { options = {}; }
    common_1.validate.getSettings({ address: address, options: options });
    var request = {
        command: 'account_info',
        account: address,
        ledger_index: options.ledgerVersion || 'validated',
        signer_lists: true
    };
    return this.connection.request(request).then(formatSettings);
}
exports.default = getSettings;
//# sourceMappingURL=settings.js.map