"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var common_1 = require("../common");
function createPaymentChannelCreateTransaction(account, paymentChannel) {
    var txJSON = {
        Account: account,
        TransactionType: 'PaymentChannelCreate',
        Amount: common_1.callToDrops(paymentChannel.amount),
        Destination: paymentChannel.destination,
        SettleDelay: paymentChannel.settleDelay,
        PublicKey: paymentChannel.publicKey.toUpperCase()
    };
    if (paymentChannel.cancelAfter !== undefined) {
        txJSON.CancelAfter = common_1.iso8601ToCallTime(paymentChannel.cancelAfter);
    }
    if (paymentChannel.sourceTag !== undefined) {
        txJSON.SourceTag = paymentChannel.sourceTag;
    }
    if (paymentChannel.destinationTag !== undefined) {
        txJSON.DestinationTag = paymentChannel.destinationTag;
    }
    return txJSON;
}
function preparePaymentChannelCreate(address, paymentChannelCreate, instructions) {
    if (instructions === void 0) { instructions = {}; }
    common_1.validate.preparePaymentChannelCreate({ address: address, paymentChannelCreate: paymentChannelCreate, instructions: instructions });
    var txJSON = createPaymentChannelCreateTransaction(address, paymentChannelCreate);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = preparePaymentChannelCreate;
//# sourceMappingURL=payment-channel-create.js.map