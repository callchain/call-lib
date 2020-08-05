"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var utils_1 = require("./utils");
var amount_1 = require("./amount");
var common_1 = require("../../common");
var flags = common_1.txFlags.OfferCreate;
function parseOrder(tx) {
    assert(tx.TransactionType === 'OfferCreate');
    var direction = (tx.Flags & flags.Sell) === 0 ? 'buy' : 'sell';
    var takerGetsAmount = amount_1.default(tx.TakerGets);
    var takerPaysAmount = amount_1.default(tx.TakerPays);
    var quantity = (direction === 'buy') ? takerPaysAmount : takerGetsAmount;
    var totalPrice = (direction === 'buy') ? takerGetsAmount : takerPaysAmount;
    return common_1.removeUndefined({
        direction: direction,
        quantity: quantity,
        totalPrice: totalPrice,
        passive: ((tx.Flags & flags.Passive) !== 0) || undefined,
        immediateOrCancel: ((tx.Flags & flags.ImmediateOrCancel) !== 0)
            || undefined,
        fillOrKill: ((tx.Flags & flags.FillOrKill) !== 0) || undefined,
        expirationTime: utils_1.parseTimestamp(tx.Expiration)
    });
}
exports.default = parseOrder;
//# sourceMappingURL=order.js.map