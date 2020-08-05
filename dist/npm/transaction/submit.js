"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils = require("./utils");
function isImmediateRejection(engineResult) {
    // note: "tel" errors mean the local server refused to process the
    // transaction *at that time*, but it could potentially buffer the
    // transaction and then process it at a later time, for example
    // if the required fee changes (this does not occur at the time of
    // this writing, but it could change in the future)
    // all other error classes can potentially result in transaction validation
    return _.startsWith(engineResult, 'tem');
}
function formatSubmitResponse(response) {
    var data = {
        resultCode: response.engine_result,
        resultMessage: response.engine_result_message
    };
    if (isImmediateRejection(response.engine_result)) {
        throw new utils.common.errors.CalledError('Submit failed', data);
    }
    return data;
}
function submit(transaction, isSigned) {
    var request = {};
    if (isSigned) {
        request = {
            command: 'submit',
            tx_blob: transaction.signedTransaction
        };
    }
    else {
        request = {
            command: 'submit',
            secret: transaction.secret,
            tx_json: JSON.parse(transaction.tx_json)
        };
    }
    return this.connection.request(request).then(formatSubmitResponse);
}
exports.default = submit;
//# sourceMappingURL=submit.js.map