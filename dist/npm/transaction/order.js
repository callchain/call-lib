"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var offerFlags = utils.common.txFlags.OfferCreate;
var common_1 = require("../common");
function createOrderTransaction(account, order) {
    var takerPays = utils.common.toCalledAmount(order.direction === 'buy' ?
        order.quantity : order.totalPrice);
    var takerGets = utils.common.toCalledAmount(order.direction === 'buy' ?
        order.totalPrice : order.quantity);
    var txJSON = {
        TransactionType: 'OfferCreate',
        Account: account,
        TakerGets: takerGets,
        TakerPays: takerPays,
        Flags: 0
    };
    if (order.direction === 'sell') {
        txJSON.Flags |= offerFlags.Sell;
    }
    if (order.passive === true) {
        txJSON.Flags |= offerFlags.Passive;
    }
    if (order.immediateOrCancel === true) {
        txJSON.Flags |= offerFlags.ImmediateOrCancel;
    }
    if (order.fillOrKill === true) {
        txJSON.Flags |= offerFlags.FillOrKill;
    }
    if (order.expirationTime !== undefined) {
        txJSON.Expiration = common_1.iso8601ToCallTime(order.expirationTime);
    }
    if (order.orderToReplace !== undefined) {
        txJSON.OfferSequence = order.orderToReplace;
    }
    if (order.memos !== undefined) {
        txJSON.Memos = _.map(order.memos, utils.convertMemo);
    }
    return txJSON;
}
function prepareOrder(address, order, instructions) {
    if (instructions === void 0) { instructions = {}; }
    // validate.prepareOrder({address, order, instructions})
    var txJSON = createOrderTransaction(address, order);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareOrder;
//# sourceMappingURL=order.js.map