"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var bignumber_js_1 = require("bignumber.js");
var utils_1 = require("./utils");
var common_1 = require("../common");
var pathfind_1 = require("./parse/pathfind");
var NotFoundError = common_1.errors.NotFoundError;
var ValidationError = common_1.errors.ValidationError;
function addParams(request, result) {
    return _.defaults(_.assign({}, result, {
        source_account: request.source_account,
        source_currencies: request.source_currencies
    }), { destination_amount: request.destination_amount });
}
function requestPathFind(connection, pathfind) {
    var destinationAmount = _.assign({ value: '-1' }, pathfind.destination.amount);
    var request = {
        command: 'call_path_find',
        source_account: pathfind.source.address,
        destination_account: pathfind.destination.address,
        destination_amount: common_1.toCalledAmount(destinationAmount)
    };
    if (typeof request.destination_amount === 'object'
        && !request.destination_amount.issuer) {
        request.destination_amount.issuer = request.destination_account;
    }
    if (pathfind.source.currencies && pathfind.source.currencies.length > 0) {
        request.source_currencies = pathfind.source.currencies.map(function (amount) { return utils_1.renameCounterpartyToIssuer(amount); });
    }
    if (pathfind.source.amount) {
        if (pathfind.destination.amount.value !== undefined) {
            throw new ValidationError('Cannot specify both source.amount'
                + ' and destination.amount.value in getPaths');
        }
        request.send_max = common_1.toCalledAmount(pathfind.source.amount);
        if (typeof request.send_max !== 'string' && !request.send_max.issuer) {
            request.send_max.issuer = pathfind.source.address;
        }
    }
    return connection.request(request).then(function (paths) { return addParams(request, paths); });
}
function addDirectCallPath(paths, callBalance) {
    // Add CALL "path" only if the source acct has enough CALL to make the payment
    var destinationAmount = paths.destination_amount;
    // @ts-ignore: destinationAmount can be a currency amount object! Fix!
    if ((new bignumber_js_1.default(callBalance)).greaterThanOrEqualTo(destinationAmount)) {
        paths.alternatives.unshift({
            paths_computed: [],
            source_amount: paths.destination_amount
        });
    }
    return paths;
}
function isCalledIOUAmount(amount) {
    return (typeof amount === 'object') &&
        amount.currency && (amount.currency !== 'CALL');
}
function conditionallyAddDirectCALLPath(connection, address, paths) {
    if (isCalledIOUAmount(paths.destination_amount)
        || !_.includes(paths.destination_currencies, 'CALL')) {
        return Promise.resolve(paths);
    }
    return utils_1.getCALLBalance(connection, address, undefined).then(function (callBalance) { return addDirectCallPath(paths, callBalance); });
}
function filterSourceFundsLowPaths(pathfind, paths) {
    if (pathfind.source.amount &&
        pathfind.destination.amount.value === undefined && paths.alternatives) {
        paths.alternatives = _.filter(paths.alternatives, function (alt) {
            return !!alt.source_amount &&
                !!pathfind.source.amount &&
                // TODO: Returns false when alt.source_amount is a string. Fix?
                typeof alt.source_amount !== 'string' &&
                new bignumber_js_1.default(alt.source_amount.value).eq(pathfind.source.amount.value);
        });
    }
    return paths;
}
function formatResponse(pathfind, paths) {
    if (paths.alternatives && paths.alternatives.length > 0) {
        return pathfind_1.default(paths);
    }
    if (paths.destination_currencies !== undefined &&
        !_.includes(paths.destination_currencies, pathfind.destination.amount.currency)) {
        throw new NotFoundError('No paths found. ' +
            'The destination_account does not accept ' +
            pathfind.destination.amount.currency + ', they only accept: ' +
            paths.destination_currencies.join(', '));
    }
    else if (paths.source_currencies && paths.source_currencies.length > 0) {
        throw new NotFoundError('No paths found. Please ensure' +
            ' that the source_account has sufficient funds to execute' +
            ' the payment in one of the specified source_currencies. If it does' +
            ' there may be insufficient liquidity in the network to execute' +
            ' this payment right now');
    }
    else {
        throw new NotFoundError('No paths found.' +
            ' Please ensure that the source_account has sufficient funds to' +
            ' execute the payment. If it does there may be insufficient liquidity' +
            ' in the network to execute this payment right now');
    }
}
function getPaths(pathfind) {
    var _this = this;
    common_1.validate.getPaths({ pathfind: pathfind });
    var address = pathfind.source.address;
    return requestPathFind(this.connection, pathfind).then(function (paths) {
        return conditionallyAddDirectCALLPath(_this.connection, address, paths);
    })
        .then(function (paths) { return filterSourceFundsLowPaths(pathfind, paths); })
        .then(function (paths) { return formatResponse(pathfind, paths); });
}
exports.default = getPaths;
//# sourceMappingURL=pathfind.js.map