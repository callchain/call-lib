"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils_1 = require("./utils");
var common_1 = require("../../common");
var flags_1 = require("./flags");
var amount_1 = require("./amount");
function parseOrderbookOrder(order) {
    var direction = (order.Flags & flags_1.orderFlags.Sell) === 0 ? 'buy' : 'sell';
    var takerGetsAmount = amount_1.default(order.TakerGets);
    var takerPaysAmount = amount_1.default(order.TakerPays);
    var quantity = (direction === 'buy') ? takerPaysAmount : takerGetsAmount;
    var totalPrice = (direction === 'buy') ? takerGetsAmount : takerPaysAmount;
    // note: immediateOrCancel and fillOrKill orders cannot enter the order book
    // so we can omit those flags here
    var specification = common_1.removeUndefined({
        direction: direction,
        quantity: quantity,
        totalPrice: totalPrice,
        passive: ((order.Flags & flags_1.orderFlags.Passive) !== 0) || undefined,
        expirationTime: utils_1.parseTimestamp(order.Expiration)
    });
    var properties = {
        maker: order.Account,
        sequence: order.Sequence,
        makerExchangeRate: utils_1.adjustQualityForCALL(order.quality, takerGetsAmount.currency, takerPaysAmount.currency)
    };
    var takerGetsFunded = order.taker_gets_funded ?
        amount_1.default(order.taker_gets_funded) : undefined;
    var takerPaysFunded = order.taker_pays_funded ?
        amount_1.default(order.taker_pays_funded) : undefined;
    var available = common_1.removeUndefined({
        fundedAmount: takerGetsFunded,
        priceOfFundedAmount: takerPaysFunded
    });
    var state = _.isEmpty(available) ? undefined : available;
    return common_1.removeUndefined({ specification: specification, properties: properties, state: state });
}
exports.default = parseOrderbookOrder;
//# sourceMappingURL=orderbook-order.js.map