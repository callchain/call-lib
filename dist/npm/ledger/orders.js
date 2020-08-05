"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
var common_1 = require("../common");
var account_order_1 = require("./parse/account-order");
function requestAccountOffers(connection, address, ledgerVersion, marker, limit) {
    return connection.request({
        command: 'account_offers',
        account: address,
        marker: marker,
        limit: utils.clamp(limit, 10, 400),
        ledger_index: ledgerVersion
    }).then(function (data) { return ({
        marker: data.marker,
        results: data.offers.map(_.partial(account_order_1.default, address))
    }); });
}
function getOrders(address, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    common_1.validate.getOrders({ address: address, options: options });
    return utils.ensureLedgerVersion.call(this, options).then(function (_options) {
        var getter = _.partial(requestAccountOffers, _this.connection, address, _options.ledgerVersion);
        // return utils.getRecursive(getter, _options.limit).then(orders.results => _.sortBy(orders, order => order.properties.sequence))
        return utils.getRecursive(getter, _options.limit, _options.marker);
    });
}
exports.default = getOrders;
//# sourceMappingURL=orders.js.map