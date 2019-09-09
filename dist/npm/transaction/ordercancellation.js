"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var validate = utils.common.validate;
function createOrderCancellationTransaction(account, orderCancellation) {
    var txJSON = {
        TransactionType: 'OfferCancel',
        Account: account,
        OfferSequence: orderCancellation.orderSequence
    };
    if (orderCancellation.memos !== undefined) {
        txJSON.Memos = _.map(orderCancellation.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareOrderCancellation(address, orderCancellation, instructions) {
    if (instructions === void 0) { instructions = {}; }
    validate.prepareOrderCancellation({ address: address, orderCancellation: orderCancellation, instructions: instructions });
    var txJSON = createOrderCancellationTransaction(address, orderCancellation);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareOrderCancellation;
//# sourceMappingURL=ordercancellation.js.map