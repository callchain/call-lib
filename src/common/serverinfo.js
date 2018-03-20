"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils_1 = require("./utils");
var bignumber_js_1 = require("bignumber.js");
function renameKeys(object, mapping) {
    _.forEach(mapping, function (to, from) {
        object[to] = object[from];
        delete object[from];
    });
}
function getServerInfo(connection) {
    return connection.request({ command: 'server_info' }).then(function (response) {
        var info = utils_1.convertKeysFromSnakeCaseToCamelCase(response.info);
        renameKeys(info, { hostid: 'hostID' });
        if (info.validatedLedger) {
            renameKeys(info.validatedLedger, {
                baseFeeXrp: 'baseFeeXRP',
                reserveBaseXrp: 'reserveBaseXRP',
                reserveIncXrp: 'reserveIncrementXRP',
                seq: 'ledgerVersion'
            });
            info.validatedLedger.baseFeeXRP =
                info.validatedLedger.baseFeeXRP.toString();
            info.validatedLedger.reserveBaseXRP =
                info.validatedLedger.reserveBaseXRP.toString();
            info.validatedLedger.reserveIncrementXRP =
                info.validatedLedger.reserveIncrementXRP.toString();
        }
        return info;
    });
}
exports.getServerInfo = getServerInfo;
function computeFeeFromServerInfo(cushion, serverInfo) {
    return (new bignumber_js_1.default(serverInfo.validatedLedger.baseFeeXRP)).
        times(serverInfo.loadFactor).
        times(cushion).toString();
}
function getFee(connection, cushion) {
    return getServerInfo(connection).then(function (serverInfo) {
        return computeFeeFromServerInfo(cushion, serverInfo);
    });
}
exports.getFee = getFee;
