"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var common_1 = require("../common");
function createPaymentChannelFundTransaction(account, fund) {
    var txJSON = {
        Account: account,
        TransactionType: 'PaymentChannelFund',
        Channel: fund.channel,
        Amount: common_1.callToDrops(fund.amount)
    };
    if (fund.expiration !== undefined) {
        txJSON.Expiration = common_1.iso8601ToCallTime(fund.expiration);
    }
    return txJSON;
}
function preparePaymentChannelFund(address, paymentChannelFund, instructions) {
    if (instructions === void 0) { instructions = {}; }
    common_1.validate.preparePaymentChannelFund({ address: address, paymentChannelFund: paymentChannelFund, instructions: instructions });
    var txJSON = createPaymentChannelFundTransaction(address, paymentChannelFund);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = preparePaymentChannelFund;
//# sourceMappingURL=payment-channel-fund.js.map