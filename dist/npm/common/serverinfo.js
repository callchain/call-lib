"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var bignumber_js_1 = require("bignumber.js");
// function renameKeys(object, mapping) {
//   _.forEach(mapping, (to, from) => {
//     object[to] = object[from]
//     delete object[from]
//   })
// }
function getServerInfo(connection) {
    return connection.request({ command: 'server_info' }).then(function (response) {
        var info = utils_1.convertKeysFromSnakeCaseToCamelCase(response.info);
        // renameKeys(info, {hostid: 'hostID'})
        // if (info.validatedLedger) {
        //   renameKeys(info.validatedLedger, {
        //     baseFeeCall: 'baseFeeCALL',
        //     reserveBaseCall: 'reserveBaseCALL',
        //     reserveIncCall: 'reserveIncrementCALL',
        //     seq: 'ledgerVersion'
        //   })
        //   info.validatedLedger.baseFeeCALL =
        //     info.validatedLedger.baseFeeCALL.toString()
        //   info.validatedLedger.reserveBaseCALL =
        //     info.validatedLedger.reserveBaseCALL.toString()
        //   info.validatedLedger.reserveIncrementCALL =
        //     info.validatedLedger.reserveIncrementCALL.toString()
        // }
        return info;
    });
}
exports.getServerInfo = getServerInfo;
function computeFeeFromServerInfo(cushion, serverInfo) {
    return (new bignumber_js_1.default(serverInfo.validatedLedger.baseFeeCALL)).
        times(serverInfo.loadFactor).
        times(cushion).toString();
}
function getFee(connection, cushion) {
    return getServerInfo(connection).then(function (serverInfo) {
        return computeFeeFromServerInfo(cushion, serverInfo);
    });
}
exports.getFee = getFee;
//# sourceMappingURL=serverinfo.js.map