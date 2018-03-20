"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var utils_1 = require("./utils");
var common_1 = require("../../common");
var payment_1 = require("./payment");
var trustline_1 = require("./trustline");
var order_1 = require("./order");
var cancellation_1 = require("./cancellation");
var settings_1 = require("./settings");
var escrow_creation_1 = require("./escrow-creation");
var escrow_execution_1 = require("./escrow-execution");
var escrow_cancellation_1 = require("./escrow-cancellation");
var payment_channel_create_1 = require("./payment-channel-create");
var payment_channel_fund_1 = require("./payment-channel-fund");
var payment_channel_claim_1 = require("./payment-channel-claim");
var fee_update_1 = require("./fee-update");
var amendment_1 = require("./amendment");
function parseTransactionType(type) {
    var mapping = {
        Payment: 'payment',
        TrustSet: 'trustline',
        OfferCreate: 'order',
        OfferCancel: 'orderCancellation',
        AccountSet: 'settings',
        SetRegularKey: 'settings',
        EscrowCreate: 'escrowCreation',
        EscrowFinish: 'escrowExecution',
        EscrowCancel: 'escrowCancellation',
        PaymentChannelCreate: 'paymentChannelCreate',
        PaymentChannelFund: 'paymentChannelFund',
        PaymentChannelClaim: 'paymentChannelClaim',
        SignerListSet: 'settings',
        SetFee: 'feeUpdate',
        EnableAmendment: 'amendment' // pseudo-transaction
    };
    return mapping[type] || null;
}
function parseTransaction(tx) {
    var type = parseTransactionType(tx.TransactionType);
    var mapping = {
        'payment': payment_1.default,
        'trustline': trustline_1.default,
        'order': order_1.default,
        'orderCancellation': cancellation_1.default,
        'settings': settings_1.default,
        'escrowCreation': escrow_creation_1.default,
        'escrowExecution': escrow_execution_1.default,
        'escrowCancellation': escrow_cancellation_1.default,
        'paymentChannelCreate': payment_channel_create_1.default,
        'paymentChannelFund': payment_channel_fund_1.default,
        'paymentChannelClaim': payment_channel_claim_1.default,
        'feeUpdate': fee_update_1.default,
        'amendment': amendment_1.default
    };
    var parser = mapping[type];
    assert(parser !== undefined, 'Unrecognized transaction type');
    var specification = parser(tx);
    var outcome = utils_1.parseOutcome(tx);
    return common_1.removeUndefined({
        type: type,
        address: tx.Account,
        sequence: tx.Sequence,
        id: tx.hash,
        specification: common_1.removeUndefined(specification),
        outcome: outcome ? common_1.removeUndefined(outcome) : undefined
    });
}
exports.default = parseTransaction;
