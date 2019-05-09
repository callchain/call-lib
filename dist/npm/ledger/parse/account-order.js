"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var amount_1 = require("./amount");
var utils_1 = require("./utils");
var common_1 = require("../../common");
var flags_1 = require("./flags");
function computeQuality(takerGets, takerPays) {
    var quotient = new bignumber_js_1.default(takerPays.value).dividedBy(takerGets.value);
    return quotient.toDigits(16, bignumber_js_1.default.ROUND_HALF_UP).toString();
}
function parseAccountOrder(address, order) {
    var direction = (order.flags & flags_1.orderFlags.Sell) === 0 ? 'buy' : 'sell';
    var takerGetsAmount = amount_1.default(order.taker_gets);
    var takerPaysAmount = amount_1.default(order.taker_pays);
    var quantity = (direction === 'buy') ? takerPaysAmount : takerGetsAmount;
    var totalPrice = (direction === 'buy') ? takerGetsAmount : takerPaysAmount;
    // note: immediateOrCancel and fillOrKill orders cannot enter the order book
    // so we can omit those flags here
    var specification = common_1.removeUndefined({
        direction: direction,
        quantity: quantity,
        totalPrice: totalPrice,
        passive: ((order.flags & flags_1.orderFlags.Passive) !== 0) || undefined,
        expirationTime: utils_1.parseTimestamp(order.expiration)
    });
    var makerExchangeRate = order.quality ?
        utils_1.adjustQualityForCALL(order.quality.toString(), takerGetsAmount.currency, takerPaysAmount.currency) :
        computeQuality(takerGetsAmount, takerPaysAmount);
    var properties = {
        maker: address,
        sequence: order.seq,
        makerExchangeRate: makerExchangeRate
    };
    return { specification: specification, properties: properties };
}
exports.default = parseAccountOrder;
//# sourceMappingURL=account-order.js.map