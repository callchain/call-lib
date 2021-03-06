"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var errors_1 = require("./errors");
var schema_validator_1 = require("./schema-validator");
function error(text) {
    return new errors_1.ValidationError(text);
}
function validateLedgerRange(options) {
    if (!_.isUndefined(options) && !_.isUndefined(options.minLedgerVersion)
        && !_.isUndefined(options.maxLedgerVersion)) {
        if (Number(options.minLedgerVersion) > Number(options.maxLedgerVersion)) {
            throw error('minLedgerVersion must not be greater than maxLedgerVersion');
        }
    }
}
function validateOptions(schema, instance) {
    schema_validator_1.schemaValidate(schema, instance);
    validateLedgerRange(instance.options);
}
exports.getPaths = _.partial(schema_validator_1.schemaValidate, 'getPathsParameters');
exports.getTransactions = _.partial(validateOptions, 'getTransactionsParameters');
exports.getSettings = _.partial(validateOptions, 'getSettingsParameters');
exports.getAccountInfo = _.partial(validateOptions, 'getAccountInfoParameters');
exports.getTrustlines = _.partial(validateOptions, 'getTrustlinesParameters');
exports.getBalances = _.partial(validateOptions, 'getBalancesParameters');
exports.getBalanceSheet = _.partial(validateOptions, 'getBalanceSheetParameters');
exports.getOrders = _.partial(validateOptions, 'getOrdersParameters');
exports.getOrderbook = _.partial(validateOptions, 'getOrderbookParameters');
exports.getTransaction = _.partial(validateOptions, 'getTransactionParameters');
exports.getLedger = _.partial(validateOptions, 'getLedgerParameters');
exports.preparePayment = _.partial(schema_validator_1.schemaValidate, 'preparePaymentParameters');
exports.prepareOrder = _.partial(schema_validator_1.schemaValidate, 'prepareOrderParameters');
exports.prepareOrderCancellation = _.partial(schema_validator_1.schemaValidate, 'prepareOrderCancellationParameters');
exports.prepareTrustline = _.partial(schema_validator_1.schemaValidate, 'prepareTrustlineParameters');
exports.prepareSettings = _.partial(schema_validator_1.schemaValidate, 'prepareSettingsParameters');
exports.prepareIssueSet = _.partial(schema_validator_1.schemaValidate, 'prepareIssueSetParameters');
exports.sign = _.partial(schema_validator_1.schemaValidate, 'signParameters');
exports.combine = _.partial(schema_validator_1.schemaValidate, 'combineParameters');
exports.submit = _.partial(schema_validator_1.schemaValidate, 'submitParameters');
exports.computeLedgerHash = _.partial(schema_validator_1.schemaValidate, 'computeLedgerHashParameters');
exports.generateAddress = _.partial(schema_validator_1.schemaValidate, 'generateAddressParameters');
exports.apiOptions = _.partial(schema_validator_1.schemaValidate, 'api-options');
exports.instructions = _.partial(schema_validator_1.schemaValidate, 'instructions');
//# sourceMappingURL=validate.js.map