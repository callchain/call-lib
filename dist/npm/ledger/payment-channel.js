"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var payment_channel_1 = require("./parse/payment-channel");
var common_1 = require("../common");
var NotFoundError = common_1.errors.NotFoundError;
function formatResponse(response) {
    if (response.node !== undefined &&
        response.node.LedgerEntryType === 'PayChannel') {
        return payment_channel_1.default(response.node);
    }
    else {
        throw new NotFoundError('Payment channel ledger entry not found');
    }
}
function getPaymentChannel(id) {
    common_1.validate.getPaymentChannel({ id: id });
    var request = {
        command: 'ledger_entry',
        index: id,
        binary: false,
        ledger_index: 'validated'
    };
    return this.connection.request(request).then(formatResponse);
}
exports.default = getPaymentChannel;
//# sourceMappingURL=payment-channel.js.map