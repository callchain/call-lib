"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var events_1 = require("events");
var common_1 = require("./common");
var server = require("./server/server");
var connect = server.connect;
var disconnect = server.disconnect;
var getServerInfo = server.getServerInfo;
var getFee = server.getFee;
var isConnected = server.isConnected;
var getLedgerVersion = server.getLedgerVersion;
var transaction_1 = require("./ledger/transaction");
var transactions_1 = require("./ledger/transactions");
var trustlines_1 = require("./ledger/trustlines");
var balances_1 = require("./ledger/balances");
var balance_sheet_1 = require("./ledger/balance-sheet");
var pathfind_1 = require("./ledger/pathfind");
var orders_1 = require("./ledger/orders");
var orderbook_1 = require("./ledger/orderbook");
var settings_1 = require("./ledger/settings");
var accountinfo_1 = require("./ledger/accountinfo");
var accountbyname_1 = require("./ledger/accountbyname");
var accountissues_1 = require("./ledger/accountissues");
var accountinvoices_1 = require("./ledger/accountinvoices");
var payment_channel_1 = require("./ledger/payment-channel");
var issue_set_1 = require("./transaction/issue-set");
var payment_1 = require("./transaction/payment");
var trustline_1 = require("./transaction/trustline");
var order_1 = require("./transaction/order");
var ordercancellation_1 = require("./transaction/ordercancellation");
var escrow_creation_1 = require("./transaction/escrow-creation");
var escrow_execution_1 = require("./transaction/escrow-execution");
var escrow_cancellation_1 = require("./transaction/escrow-cancellation");
var payment_channel_create_1 = require("./transaction/payment-channel-create");
var payment_channel_fund_1 = require("./transaction/payment-channel-fund");
var payment_channel_claim_1 = require("./transaction/payment-channel-claim");
var settings_2 = require("./transaction/settings");
var sign_1 = require("./transaction/sign");
var combine_1 = require("./transaction/combine");
var submit_1 = require("./transaction/submit");
var generate_address_1 = require("./offline/generate-address");
var address_fromSecret_1 = require("./offline/address-fromSecret");
var ledgerhash_1 = require("./offline/ledgerhash");
var sign_payment_channel_claim_1 = require("./offline/sign-payment-channel-claim");
var verify_payment_channel_claim_1 = require("./offline/verify-payment-channel-claim");
var ledger_1 = require("./ledger/ledger");
var rangeset_1 = require("./common/rangeset");
var ledgerUtils = require("./ledger/utils");
var schemaValidator = require("./common/schema-validator");
// prevent access to non-validated ledger versions
var RestrictedConnection = /** @class */ (function (_super) {
    __extends(RestrictedConnection, _super);
    function RestrictedConnection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RestrictedConnection.prototype.request = function (request, timeout) {
        var ledger_index = request.ledger_index;
        if (ledger_index !== undefined && ledger_index !== 'validated') {
            if (!_.isNumber(ledger_index) || ledger_index > this._ledgerVersion) {
                return Promise.reject(new common_1.errors.LedgerVersionError("ledgerVersion " + ledger_index + " is greater than server's " +
                    ("most recent validated ledger: " + this._ledgerVersion)));
            }
        }
        return _super.prototype.request.call(this, request, timeout);
    };
    return RestrictedConnection;
}(common_1.Connection));
var CallAPI = /** @class */ (function (_super) {
    __extends(CallAPI, _super);
    function CallAPI(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.connect = connect;
        _this.disconnect = disconnect;
        _this.isConnected = isConnected;
        _this.getServerInfo = getServerInfo;
        _this.getFee = getFee;
        _this.getLedgerVersion = getLedgerVersion;
        _this.getTransaction = transaction_1.default;
        _this.getTransactions = transactions_1.default;
        _this.getTrustlines = trustlines_1.default;
        _this.getBalances = balances_1.default;
        _this.getBalanceSheet = balance_sheet_1.default;
        _this.getPaths = pathfind_1.default;
        _this.getOrders = orders_1.default;
        _this.getOrderbook = orderbook_1.default;
        _this.getSettings = settings_1.default;
        _this.getAccountInfo = accountinfo_1.default;
        _this.getAccountByName = accountbyname_1.default;
        _this.getAccountIssues = accountissues_1.default;
        _this.getAccountInvoices = accountinvoices_1.default;
        _this.getPaymentChannel = payment_channel_1.default;
        _this.getLedger = ledger_1.default;
        _this.prepareIssueSet = issue_set_1.default;
        _this.preparePayment = payment_1.default;
        _this.prepareTrustline = trustline_1.default;
        _this.prepareOrder = order_1.default;
        _this.prepareOrderCancellation = ordercancellation_1.default;
        _this.prepareEscrowCreation = escrow_creation_1.default;
        _this.prepareEscrowExecution = escrow_execution_1.default;
        _this.prepareEscrowCancellation = escrow_cancellation_1.default;
        _this.preparePaymentChannelCreate = payment_channel_create_1.default;
        _this.preparePaymentChannelFund = payment_channel_fund_1.default;
        _this.preparePaymentChannelClaim = payment_channel_claim_1.default;
        _this.prepareSettings = settings_2.default;
        _this.sign = sign_1.default;
        _this.combine = combine_1.default;
        _this.submit = submit_1.default;
        _this.generateAddress = generate_address_1.generateAddressAPI;
        _this.fromSecret = address_fromSecret_1.fromSecret;
        _this.computeLedgerHash = ledgerhash_1.default;
        _this.signPaymentChannelClaim = sign_payment_channel_claim_1.default;
        _this.verifyPaymentChannelClaim = verify_payment_channel_claim_1.default;
        _this.errors = common_1.errors;
        common_1.validate.apiOptions(options);
        _this._feeCushion = options.feeCushion || 1.2;
        var serverURL = options.server;
        if (serverURL !== undefined) {
            _this.connection = new RestrictedConnection(serverURL, options);
            _this.connection.on('ledgerClosed', function (message) {
                _this.emit('ledger', server.formatLedgerClose(message));
            });
            _this.connection.on('transaction', function (message) {
                _this.emit('transactions', message);
            });
            _this.connection.on('error', function (errorCode, errorMessage, data) {
                _this.emit('error', errorCode, errorMessage, data);
            });
            _this.connection.on('connected', function () {
                _this.emit('connected');
            });
            _this.connection.on('disconnected', function (code) {
                _this.emit('disconnected', code);
            });
        }
        else {
            // use null object pattern to provide better error message if user
            // tries to call a method that requires a connection
            _this.connection = new RestrictedConnection(null, options);
        }
        return _this;
    }
    // these are exposed only for use by unit tests; they are not part of the API.
    CallAPI._PRIVATE = {
        validate: common_1.validate,
        RangeSet: rangeset_1.default,
        ledgerUtils: ledgerUtils,
        schemaValidator: schemaValidator
    };
    return CallAPI;
}(events_1.EventEmitter));
exports.CallAPI = CallAPI;
//# sourceMappingURL=api.js.map